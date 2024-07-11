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
import {
  dryrun,
  message,
  monitor,
  result,
  results,
  spawn,
  unmonitor,
} from '@permaweb/aoconnect';
import { ArconnectSigner, ArweaveSigner } from 'arbundles';

import {
  AllowedProtocols,
  GatewayConnectionSettings,
  GatewayMetadata,
  GatewayStakingSettings,
} from './contract-state.js';
import { mIOToken } from './token.js';

export type BlockHeight = number;
export type SortKey = string;
export type Timestamp = number;
export type WalletAddress = string;
export type TransactionId = string;
export type ProcessId = string;

// TODO: append this with other configuration options (e.g. local vs. remote evaluation)
export type ContractSigner = ArweaveSigner | ArconnectSigner;
export type WithSigner<T = NonNullable<unknown>> = {
  signer: ContractSigner;
} & T; // TODO: optionally allow JWK in place of signer
export type OptionalSigner<T = NonNullable<unknown>> = {
  signer?: ContractSigner | undefined;
} & T;

export type ReadParameters<Input> = {
  functionName: string;
  inputs?: Input;
};

export type WriteOptions = {
  tags?: { name: string; value: string }[];
};

export type WriteParameters<Input> = WithSigner<
  Required<ReadParameters<Input>>
>;

export type AoMessageResult = { id: string };

// Helper type to overwrite properties of A with B
type Overwrite<T, U> = {
  [K in keyof T]: K extends keyof U ? U[K] : T[K];
};

export type JoinNetworkParams = Overwrite<
  GatewayConnectionSettings & GatewayStakingSettings & GatewayMetadata,
  {
    minDelegatedStake: number | mIOToken; // TODO: this is for backwards compatibility
  }
> & {
  qty: number | mIOToken; // TODO: this is for backwards compatibility
  observerWallet?: WalletAddress;
};

// Original type definition refined with proper field-specific types
export type UpdateGatewaySettingsParamsBase = {
  allowDelegatedStaking?: boolean;
  delegateRewardShareRatio?: number;
  fqdn?: string;
  label?: string;
  minDelegatedStake?: number | mIOToken; // TODO: this is for backwards compatibility - eventually we'll drop number
  note?: string;
  port?: number;
  properties?: string;
  protocol?: AllowedProtocols;
  autoStake?: boolean;
  observerWallet?: WalletAddress;
};

// Utility type to require at least one of the fields
export type AtLeastOne<
  T,
  U = { [K in keyof T]-?: Record<K, T[K]> },
> = Partial<T> & U[keyof U];

// Define the type used for function parameters
export type UpdateGatewaySettingsParams =
  AtLeastOne<UpdateGatewaySettingsParamsBase>;

export interface HTTPClient {
  get<I, K>({
    endpoint,
    signal,
    headers,
    allowedStatuses,
    params,
  }: {
    endpoint: string;
    signal?: AbortSignal;
    headers?: Record<string, string>;
    allowedStatuses?: number[];
    params?: object | I;
  }): Promise<K>;
}

export interface AoClient {
  result: typeof result;
  results: typeof results;
  message: typeof message;
  spawn: typeof spawn;
  monitor: typeof monitor;
  unmonitor: typeof unmonitor;
  dryrun: typeof dryrun;
}
