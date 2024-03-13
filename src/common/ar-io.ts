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
import { ARNS_TESTNET_REGISTRY_TX } from '../constants.js';
import {
  ArIOContract,
  ArIOState,
  ArNSNameData,
  EpochDistributionData,
  EvaluationParameters,
  Gateway,
  Observations,
  SmartWeaveContract,
} from '../types.js';
import { RemoteContract } from './contracts/remote-contract.js';

// TODO: append this with other configuration options (e.g. local vs. remote evaluation)
export type ContractConfiguration =
  | {
    contract?: SmartWeaveContract<unknown>;
  }
  | {
    contractTxId: string;
  };

function isContractConfiguration<T>(
  config: ContractConfiguration,
): config is { contract: SmartWeaveContract<T> } {
  return 'contract' in config;
}

function isContractTxIdConfiguration(
  config: ContractConfiguration,
): config is { contractTxId: string } {
  return 'contractTxId' in config;
}

export class ArIO implements ArIOContract {
  private contract: SmartWeaveContract<ArIOState>;

  constructor(
    config: ContractConfiguration = {
      // default to a contract that uses the arns service to do the evaluation
      contract: new RemoteContract<ArIOState>({
        contractTxId: ARNS_TESTNET_REGISTRY_TX,
      }),
    },
  ) {
    if (isContractConfiguration<ArIOState>(config)) {
      this.contract = config.contract;
    } else if (isContractTxIdConfiguration(config)) {
      this.contract = new RemoteContract<ArIOState>({
        contractTxId: config.contractTxId,
      });
    }
  }

  /**
   * Returns the current state of the contract.
   */
  async getState(params: EvaluationParameters): Promise<ArIOState> {
    const state = await this.contract.getContractState(params);
    return state;
  }

  /**
   * Returns the ARNS record for the given domain.
   */
  async getArNSRecord({
    domain,
    evaluationOptions,
  }: EvaluationParameters<{ domain: string }>): Promise<
    ArNSNameData | undefined
  > {
    const records = await this.getArNSRecords({ evaluationOptions });
    return records[domain];
  }

  /**
   * Returns all ArNS records.
   */
  async getArNSRecords({
    evaluationOptions,
  }: EvaluationParameters = {}): Promise<Record<string, ArNSNameData>> {
    const state = await this.contract.getContractState({ evaluationOptions });
    return state.records;
  }

  /**
   * Returns the balance of the given address.
   */
  async getBalance({
    address,
    evaluationOptions,
  }: EvaluationParameters<{ address: string }>): Promise<number> {
    const balances = await this.getBalances({ evaluationOptions });
    return balances[address] || 0;
  }

  /**
   * Returns the balances of all addresses.
   */
  async getBalances({ evaluationOptions }: EvaluationParameters = {}): Promise<
    Record<string, number>
  > {
    const state = await this.contract.getContractState({ evaluationOptions });
    return state.balances;
  }

  /**
   * Returns the gateway for the given address, including weights.
   */
  async getGateway({
    address,
    evaluationOptions,
  }: EvaluationParameters<{ address: string }>): Promise<Gateway | undefined> {
    return this.contract
      .readInteraction<{ target: string }, Gateway>({
        functionName: 'gateway',
        inputs: {
          target: address,
        },
        evaluationOptions,
      })
      .catch(() => {
        return undefined;
      });
  }

  /**
   * Returns all gateways, including weights.
   */
  async getGateways({ evaluationOptions }: EvaluationParameters = {}): Promise<
    Record<string, Gateway> | Record<string, never>
  > {
    return this.contract.readInteraction({
      functionName: 'gateways',
      evaluationOptions,
    });
  }

  /**
   * Returns the current epoch.
   */
  async getCurrentEpoch({
    evaluationOptions,
  }: EvaluationParameters = {}): Promise<EpochDistributionData> {
    return this.contract.readInteraction({
      functionName: 'epoch',
      evaluationOptions,
    });
  }

  /**
   * Returns the epoch information for the provided block height.
   */
  async getEpoch({
    blockHeight,
    evaluationOptions,
  }: {
    blockHeight: number;
  } & EvaluationParameters): Promise<EpochDistributionData> {
    return this.contract.readInteraction<
      { height: number },
      EpochDistributionData
    >({
      functionName: 'epoch',
      inputs: {
        height: blockHeight,
      },
      evaluationOptions,
    });
  }
  async getObservations({
    epoch,
    evaluationOptions,
  }: EvaluationParameters<{ epoch?: number }> = {}): Promise<Observations> {
    const { observations } = await this.contract.getContractState({
      evaluationOptions,
    });
    return epoch !== undefined ? { [epoch]: observations[epoch] } : observations;
  }
  async getDistributions({
    epoch,
    evaluationOptions,
  }: EvaluationParameters<{
    epoch?: number;
  }> = {}): Promise<EpochDistributionData> {
    const distributions = epoch !== undefined
      ? await this.getEpoch({
        ...evaluationOptions,
        blockHeight: epoch,
      })
      : await this.contract
        .getContractState({
          evaluationOptions,
        })
        .then((state) => state.distributions);
    return distributions;
  }
}
