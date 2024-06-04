/**
 * Copyright (C) 2022-2024 Permanent Data Solutions, Inc. All Rights Reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import { ioDevnetProcessId } from '../constants.js';
import {
  ArNSNameData,
  ArNSReservedNameData,
  EpochDistributionData,
  Observations,
  WeightedObserver,
} from '../contract-state.js';
import { AoEpochData, AoGateway, AoIORead, AoIOWrite } from '../io.js';
import { mIOToken } from '../token.js';
import {
  AoMessageResult,
  ContractSigner,
  JoinNetworkParams,
  OptionalSigner,
  ProcessConfiguration,
  TransactionId,
  UpdateGatewaySettingsParams,
  WalletAddress,
  WithSigner,
} from '../types.js';
import {
  isProcessConfiguration,
  isProcessIdConfiguration,
} from '../utils/smartweave.js';
import { AOProcess } from './contracts/ao-process.js';
import { InvalidContractConfigurationError } from './error.js';

export class IO {
  static init(): AoIORead;
  static init({
    process,
    signer,
  }: WithSigner<{ process: AOProcess }>): AoIOWrite;
  static init({
    processId,
    signer,
  }: WithSigner<{
    processId: string;
  }>): AoIOWrite;
  static init({ processId }: { processId: string }): AoIORead;
  static init(
    config?: OptionalSigner<ProcessConfiguration>,
  ): AoIORead | AoIOWrite {
    if (config && config.signer) {
      const { signer, ...rest } = config;
      return new IOWriteable({
        ...rest,
        signer,
      });
    }
    return new IOReadable(config);
  }
}

export class IOReadable implements AoIORead {
  protected process: AOProcess;

  constructor(config?: ProcessConfiguration) {
    if (!config) {
      this.process = new AOProcess({
        processId: ioDevnetProcessId,
      });
    } else if (isProcessConfiguration(config)) {
      this.process = config.process;
    } else if (isProcessIdConfiguration(config)) {
      this.process = new AOProcess({
        processId: config.processId,
      });
    } else {
      throw new InvalidContractConfigurationError();
    }
  }

  async getEpoch({
    blockHeight,
  }: {
    blockHeight: number;
  }): Promise<EpochDistributionData> {
    return this.process.read<EpochDistributionData>({
      tags: [
        { name: 'Action', value: 'Epoch' },
        { name: 'BlockHeight', value: blockHeight.toString() },
      ],
    });
  }

  async getArNSRecord({
    name,
  }: {
    name: string;
  }): Promise<ArNSNameData | undefined> {
    return this.process.read<ArNSNameData>({
      tags: [
        { name: 'Action', value: 'Record' },
        { name: 'Name', value: name },
      ],
    });
  }

  async getArNSRecords(): Promise<Record<string, ArNSNameData>> {
    return this.process.read<Record<string, ArNSNameData>>({
      tags: [{ name: 'Action', value: 'Records' }],
    });
  }

  async getArNSReservedNames(): Promise<
    Record<string, ArNSReservedNameData> | Record<string, never>
  > {
    return this.process.read<Record<string, ArNSReservedNameData>>({
      tags: [{ name: 'Action', value: 'ReservedNames' }],
    });
  }

  async getArNSReservedName({
    name,
  }: {
    name: string;
  }): Promise<ArNSReservedNameData | undefined> {
    return this.process.read<ArNSReservedNameData>({
      tags: [
        { name: 'Action', value: 'ReservedName' },
        { name: 'Name', value: name },
      ],
    });
  }

  async getBalance({ address }: { address: WalletAddress }): Promise<number> {
    return this.process.read<number>({
      tags: [
        { name: 'Action', value: 'Balance' },
        { name: 'Address', value: address },
      ],
    });
  }

  async getBalances(): Promise<Record<WalletAddress, number>> {
    return this.process.read<Record<string, number>>({
      tags: [{ name: 'Action', value: 'Balances' }],
    });
  }

  async getGateway({
    address,
  }: {
    address: WalletAddress;
  }): Promise<AoGateway | undefined> {
    return this.process.read<AoGateway | undefined>({
      tags: [
        { name: 'Action', value: 'Gateway' },
        { name: 'Address', value: address },
      ],
    });
  }

  async getGateways(): Promise<
    Record<string, AoGateway> | Record<string, never>
  > {
    return this.process.read<Record<string, AoGateway>>({
      tags: [{ name: 'Action', value: 'Gateways' }],
    });
  }

  async getCurrentEpoch(): Promise<AoEpochData> {
    return this.process.read<AoEpochData>({
      tags: [
        { name: 'Action', value: 'Epoch' },
        { name: 'Timestamp', value: `${Date.now()}` },
      ],
    });
  }

  async getPrescribedObservers(): Promise<WeightedObserver[]> {
    return this.process.read<WeightedObserver[]>({
      tags: [{ name: 'Action', value: 'PrescribedObservers' }],
    });
  }

  async getObservations(): Promise<Observations> {
    return this.process.read<Observations>({
      tags: [{ name: 'Action', value: 'Observations' }],
    });
  }

  async getDistributions(): Promise<EpochDistributionData> {
    return this.process.read<EpochDistributionData>({
      tags: [{ name: 'Action', value: 'Distributions' }],
    });
  }
}

export class IOWriteable extends IOReadable implements AoIOWrite {
  protected declare process: AOProcess;
  private signer: ContractSigner;
  constructor({
    signer,
    ...config
  }: WithSigner<
    | {
        process?: AOProcess;
      }
    | { processId?: string }
  >) {
    if (Object.keys(config).length === 0) {
      super({
        process: new AOProcess({
          processId: ioDevnetProcessId,
        }),
      });
      this.signer = signer;
    } else if (isProcessConfiguration(config)) {
      super({ process: config.process });
      this.signer = signer;
    } else if (isProcessIdConfiguration(config)) {
      super({
        process: new AOProcess({
          processId: config.processId,
        }),
      });
      this.signer = signer;
    } else {
      throw new InvalidContractConfigurationError();
    }
  }

  async transfer({
    target,
    qty,
  }: {
    target: string;
    qty: number | mIOToken;
  }): Promise<AoMessageResult> {
    return this.process.send({
      tags: [
        { name: 'Action', value: 'Transfer' },
        {
          name: 'Recipient',
          value: target,
        },
        {
          name: 'Quantity',
          value: qty.valueOf().toString(),
        },
      ],
      signer: this.signer,
    });
  }

  async joinNetwork({
    operatorStake,
    allowDelegatedStaking,
    delegateRewardShareRatio,
    fqdn,
    label,
    minDelegatedStake,
    note,
    port,
    properties,
    protocol,
    autoStake,
    observerAddress,
  }: Omit<JoinNetworkParams, 'observerWallet' | 'qty'> & {
    observerAddress: string;
    operatorStake: number | mIOToken;
  }): Promise<AoMessageResult> {
    return this.process.send({
      signer: this.signer,
      tags: [
        { name: 'Action', value: 'JoinNetwork' },
        {
          name: 'Quantity',
          value: operatorStake.valueOf().toString(),
        },
        {
          name: 'AllowDelegatedStaking',
          value: allowDelegatedStaking.toString(),
        },
        {
          name: 'DelegateRewardShareRatio',
          value: delegateRewardShareRatio.toString(),
        },
        {
          name: 'FQDN',
          value: fqdn,
        },
        {
          name: 'Label',
          value: label,
        },
        {
          name: 'MinDelegatedStake',
          value: minDelegatedStake.valueOf().toString(),
        },
        {
          name: 'Note',
          value: note,
        },
        {
          name: 'Port',
          value: port.toString(),
        },
        {
          name: 'Properties',
          value: properties,
        },
        {
          name: 'Protocol',
          value: protocol,
        },
        {
          name: 'AutoStake',
          value: autoStake.toString(),
        },
        {
          name: 'ObserverAddress',
          value: observerAddress,
        },
      ],
    });
  }

  async updateGatewaySettings({
    allowDelegatedStaking,
    delegateRewardShareRatio,
    fqdn,
    label,
    minDelegatedStake,
    note,
    port,
    properties,
    protocol,
    autoStake,
    observerAddress,
  }: Omit<UpdateGatewaySettingsParams, 'observerWallet'> & {
    observerAddress: string;
  }): Promise<AoMessageResult> {
    // only include the tag if the value is not undefined
    const allTags = [
      { name: 'Action', value: 'UpdateGatewaySettings' },
      { name: 'Label', value: label },
      { name: 'Note', value: note },
      { name: 'FQDN', value: fqdn },
      { name: 'Port', value: port?.toString() },
      { name: 'Properties', value: properties },
      { name: 'Protocol', value: protocol },
      { name: 'ObserverAddress', value: observerAddress },
      {
        name: 'AllowDelegatedStaking',
        value: allowDelegatedStaking?.toString(),
      },
      {
        name: 'DelegateRewardShareRatio',
        value: delegateRewardShareRatio?.toString(),
      },
      {
        name: 'MinDelegatedStake',
        value: minDelegatedStake?.valueOf().toString(),
      },
      { name: 'AutoStake', value: autoStake?.toString() },
    ];

    const prunedTags: { name: string; value: string }[] = allTags.filter(
      (tag: {
        name: string;
        value: string | undefined;
      }): tag is { name: string; value: string } => tag.value !== undefined,
    );

    return this.process.send({
      signer: this.signer,
      tags: prunedTags,
    });
  }

  async increaseDelegateStake(params: {
    target: string;
    increaseQty: number | mIOToken;
  }): Promise<AoMessageResult> {
    return this.process.send({
      signer: this.signer,
      tags: [
        { name: 'Action', value: 'DelegateStake' },
        { name: 'Target', value: params.target },
        { name: 'Quantity', value: params.increaseQty.valueOf().toString() },
      ],
    });
  }

  async decreaseDelegateStake(params: {
    target: string;
    decreaseQty: number | mIOToken;
  }): Promise<AoMessageResult> {
    return this.process.send({
      signer: this.signer,
      tags: [
        { name: 'Action', value: 'DecreaseDelegateStake' },
        { name: 'Target', value: params.target },
        { name: 'Quantity', value: params.decreaseQty.valueOf().toString() },
      ],
    });
  }

  async increaseOperatorStake(params: {
    increaseQty: number | mIOToken;
  }): Promise<AoMessageResult> {
    return this.process.send({
      signer: this.signer,
      tags: [
        { name: 'Action', value: 'IncreaseOperatorStake' },
        { name: 'Quantity', value: params.increaseQty.valueOf().toString() },
      ],
    });
  }

  async decreaseOperatorStake(params: {
    qty: number | mIOToken;
  }): Promise<AoMessageResult> {
    return this.process.send({
      signer: this.signer,
      tags: [
        { name: 'Action', value: 'DecreaseOperatorStake' },
        { name: 'Quantity', value: params.qty.valueOf().toString() },
      ],
    });
  }

  async saveObservations(params: {
    reportTxId: TransactionId;
    failedGateways: WalletAddress[];
  }): Promise<AoMessageResult> {
    return this.process.send<
      {
        observerReportTxId: TransactionId;
        failedGateways: WalletAddress[];
      },
      never
    >({
      signer: this.signer,
      tags: [{ name: 'Action', value: 'SaveObservations' }],
      data: {
        observerReportTxId: params.reportTxId,
        failedGateways: params.failedGateways,
      },
    });
  }

  async extendLease(params: {
    name: string;
    years: number;
  }): Promise<AoMessageResult> {
    return this.process.send({
      signer: this.signer,
      tags: [
        { name: 'Action', value: 'ExtendLease' },
        { name: 'Name', value: params.name },
        { name: 'Years', value: params.years.toString() },
      ],
    });
  }

  async increaseUndernameLimit(params: {
    name: string;
    increaseCount: number;
  }): Promise<AoMessageResult> {
    return this.process.send({
      signer: this.signer,
      tags: [
        { name: 'Action', value: 'IncreaseUndernameLimit' },
        { name: 'Name', value: params.name },
        { name: 'Quantity', value: params.increaseCount.toString() },
      ],
    });
  }
}
