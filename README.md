# @ar-io/sdk

This is the home of [ar.io] SDK. This SDK provides functionality for interacting with the ar.io ecosystem of services (e.g. gateways and observers) and protocols (e.g. ArNS). It is available for both NodeJS and Web environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage](#usage)
  - [NodeJS Environments](#node)
  - [Web Environments](#web)
  - [Typescript](#typescript)
- [APIs](#apis)
  - [getBalance](#getbalance-address-evaluationoptions-)
  - [getBalances](#getbalances-evaluationoptions-)
  - [getGateway](#getgateway-address-evaluationoptions-)
  - [getGateways](#getgateways-evaluationoptions-)
  - [getArNSRecord](#getarnsrecord-domain-evaluationoptions-)
  - [getArNSRecords](#getarnsrecords-evaluationoptions-)
- [Examples](./examples)
- [Developers](#developers)
  - [Requirements](#requirements)
  - [Setup & Build](#setup--build)
  - [Testing](#testing)
  - [Linting and Formatting](#linting--formatting)
  - [Architecture](#architecture)
- [Contributing](./CONTRIBUTING.md)

## Prerequisites

- `node>=v18.0.0`
- `npm` or `yarn`

## Installation

```shell
npm install @ar-io/sdk
```

or

```shell
yarn add @ar-io/sdk
```

## Quick Start

```typescript
import { ArIO } from '@ar-io/sdk';

const arIO = new ArIO();
const gateways = arIO.getGateways();

// outputs:

// {
//   "QGWqtJdLLgm2ehFWiiPzMaoFLD50CnGuzZIPEdoDRGQ": {
//     "end": 0,
//     "observerWallet": "IPdwa3Mb_9pDD8c2IaJx6aad51Ss-_TfStVwBuhtXMs",
//     "operatorStake": 250000,
//     "settings": {
//       "fqdn": "ar-io.dev",
//       "label": "AR.IO Test",
//       "note": "Test Gateway operated by PDS for the AR.IO ecosystem.",
//       "port": 443,
//       "properties": "raJgvbFU-YAnku-WsupIdbTsqqGLQiYpGzoqk9SCVgY",
//       "protocol": "https"
//       },
//     "start": 1256694,
//     "stats": {
//       "failedConsecutiveEpochs": 0,
//       "passedEpochCount": 30,
//       "submittedEpochCount": 30,
//       "totalEpochParticipationCount": 31,
//       "totalEpochsPrescribedCount": 31
//       },
//     "status": "joined",
//     "vaults": {},
//     "weights": {
//       "stakeWeight": 25,
//       "tenureWeight": 0.9031327160493827,
//       "gatewayRewardRatioWeight": 0.96875,
//       "observerRewardRatioWeight": 0.96875,
//       "compositeWeight": 21.189222170982834,
//       "normalizedCompositeWeight": 0.27485583057217183
//       }
//   },
// "-RlCrWmyn9OaJ86tsr5qhmFRc0h5ovT5xjKQwySGZy0": {
//   "end": 0,
//   "observerWallet": "-RlCrWmyn9OaJ86tsr5qhmFRc0h5ovT5xjKQwySGZy0",
//   "operatorStake": 11300,
// ...
// }
```

## Usage

The SDK is provided in both CommonJS and ESM formats and is compatible with bundlers such as Webpack, Rollup, and ESbuild. Utilize the appropriately named exports provided by this SDK's [package.json] based on your project's configuration. Refer to the [examples] directory to see how to use the SDK in various environments.

### Web

#### Bundlers (Webpack, Rollup, ESbuild, etc.)

```javascript
import { ArIO } from '@ar-io/sdk';

// set up client
const arIO = new ArIO();
// fetch gateways
const gateways = arIO.getGateways();
```

#### Browser

```html
<script type="module">
  import { ArIO } from 'https://unpkg.com/@ar-io/sdk';

  // set up client
  const arIO = new ArIO();
  // fetch gateways
  const gateways = await arIO.getGateways();
</script>
```

#### Node

```javascript
const { ArIO } = require('@ar-io/sdk');
// set up client
const arIO = new ArIO();
// fetch gateways
const gateways = await arIO.getGateways();
```

## Typescript

The SDK provides TypeScript types. When you import the SDK in a TypeScript project types are exported from `./lib/types/[node/web]/index.d.ts` and should be automatically recognized by package managers, offering benefits such as type-checking and autocompletion.

## Configuration

### Custom Contracts

The ArIO contract client class exposes APIs relevant to the ar.io contract. It can be configured to use any contract ID that adheres to the spec of the ar.io contract. In the default case, it will automatically build and utilize a contract data provider interface that is configured to point the the known mainnet contract ID at construction time. You can provide custom contract data provider or, alternatively, a `contractTxId` to the ArIO constructor to use a different, ar.io-spec-compatible contract.

```typescript
// provide a custom contractTxId to the client and default to remote evaluation
const remoteCustomArIO = new ArIO({
  contractTxId: 'TESTNET_CONTRACT_TX_ID',
});

// provide a custom contract to the client, and specify local evaluation using warp
const localCustomArIO = new ArIO({
  contract: new WarpContract<ArIOState>({
    contractTxId: 'TESTNET_CONTRACT_TX_ID',
  }),
});

// provide a custom contract to the client, and specify local evaluation using remote cache
const remoteCacheCustomArIO = new ArIO({
  contract: new RemoteContract<ArIOState>({
    contractTxId: 'TESTNET_CONTRACT_TX_ID',
  }),
});
```

## APIs

### `getBalance({ address, evaluationOptions })`

Retrieves the balance of the specified wallet address.

```typescript
const arIO = new ArIO();
const balance = arIO.getBalance({
  address: 'INSERT_WALLET_ADDRESS',
});

// outputs: 0
```

### `getBalances({ evaluationOptions })`

Retrieves the balances of the ArIO contract.

<!--
// ALM - A part of me wonders whether streaming JSON might be beneficial in the future
// and if providing streaming versions of these APIs will scale nicely longer term, e.g.
// arIO.streamBalances({ sortingCriteria: BALANCE_DESC });
 -->

```typescript
const arIO = new ArIO();
const balances = arIO.getBalances();

// outputs:

// {
//   "-4xgjroXENKYhTWqrBo57HQwvDL51mMvSxJy6Y2Z_sA": 5000,
//   "-7vXsQZQDk8TMDlpiSLy3CnLi5PDPlAaN2DaynORpck": 5000,
//   "-9JU3W8g9nOAB1OrJQ8FxkaWCpv5slBET2HppTItbmk": 5000,
//   ...
// }
```

### `getGateway({ address, evaluationOptions })`

Retrieves a gateway's info by its staking wallet address.

```typescript
const arIO = new ArIO();
const gateway = arIO.getGateway({
  address: 'INSERT_GATEWAY_ADDRESS',
});

// outputs:

// {
//   "end": 0,
//   "observerWallet": "IPdwa3Mb_9pDD8c2IaJx6aad51Ss-_TfStVwBuhtXMs",
//   "operatorStake": 250000,
//   "settings": {
//     "fqdn": "ar-io.dev",
//     "label": "AR.IO Test",
//     "note": "Test Gateway operated by PDS for the AR.IO ecosystem.",
//     "port": 443,
//     "properties": "raJgvbFU-YAnku-WsupIdbTsqqGLQiYpGzoqk9SCVgY",
//     "protocol": "https"
//     },
//   "start": 1256694,
//   "stats": {
//     "failedConsecutiveEpochs": 0,
//     "passedEpochCount": 30,
//     "submittedEpochCount": 30,
//     "totalEpochParticipationCount": 31,
//     "totalEpochsPrescribedCount": 31
//     },
//   "status": "joined",
//   "vaults": {},
//   "weights": {
//     "stakeWeight": 25,
//     "tenureWeight": 0.9031327160493827,
//     "gatewayRewardRatioWeight": 0.96875,
//     "observerRewardRatioWeight": 0.96875,
//     "compositeWeight": 21.189222170982834,
//     "normalizedCompositeWeight": 0.27485583057217183
//     }
// }
```

### `getGateways({ evaluationOptions })`

Retrieves the registered gateways of the ArIO contract.

```typescript
const arIO = new ArIO();
const gateways = arIO.getGateways();

// outputs:

// {
//   "QGWqtJdLLgm2ehFWiiPzMaoFLD50CnGuzZIPEdoDRGQ": {
//     "end": 0,
//     "observerWallet": "IPdwa3Mb_9pDD8c2IaJx6aad51Ss-_TfStVwBuhtXMs",
//     "operatorStake": 250000,
//     "settings": {
//       "fqdn": "ar-io.dev",
//       "label": "AR.IO Test",
//       "note": "Test Gateway operated by PDS for the AR.IO ecosystem.",
//       "port": 443,
//       "properties": "raJgvbFU-YAnku-WsupIdbTsqqGLQiYpGzoqk9SCVgY",
//       "protocol": "https"
//       },
//     "start": 1256694,
//     "stats": {
//       "failedConsecutiveEpochs": 0,
//       "passedEpochCount": 30,
//       "submittedEpochCount": 30,
//       "totalEpochParticipationCount": 31,
//       "totalEpochsPrescribedCount": 31
//       },
//     "status": "joined",
//     "vaults": {},
//     "weights": {
//       "stakeWeight": 25,
//       "tenureWeight": 0.9031327160493827,
//       "gatewayRewardRatioWeight": 0.96875,
//       "observerRewardRatioWeight": 0.96875,
//       "compositeWeight": 21.189222170982834,
//       "normalizedCompositeWeight": 0.27485583057217183
//       }
// },
// "-RlCrWmyn9OaJ86tsr5qhmFRc0h5ovT5xjKQwySGZy0": {
//   "end": 0,
//   "observerWallet": "-RlCrWmyn9OaJ86tsr5qhmFRc0h5ovT5xjKQwySGZy0",
//   "operatorStake": 11300,
// ...
// }
```

### `getArNSRecord({ domain, evaluationOptions })`

Retrieves the record info of the specified ArNS name.

```typescript
const arIO = new ArIO();
const record = arIO.getArNSRecord({ domain: 'ardrive' });

// outputs

// {
//   "contractTxId": "bh9l1cy0aksiL_x9M359faGzM_yjralacHIUo8_nQXM",
//   "endTimestamp": 1711122739,
//   "startTimestamp": 1694101828,
//   "type": "lease",
//   "undernames": 100
// }
```

### `getArNSRecords({ evaluationOptions })`

Retrieves all registered ArNS records of the ArIO contract.

```typescript
const arIO = new ArIO();
const records = arIO.getArNSRecords();

// outputs:

// {
//   "ardrive": {
//     "contractTxId": "bh9l1cy0aksiL_x9M359faGzM_yjralacHIUo8_nQXM",
//     "endTimestamp": 1711122739,
//     "startTimestamp": 1694101828,
//     "type": "lease",
//     "undernames": 100
//   },
//   "ar-io": {
//     "contractTxId": "eNey-H9RB9uCdoJUvPULb35qhZVXZcEXv8xds4aHhkQ",
//     "purchasePrice": 17386.717520731843,
//     "startTimestamp": 1706747215,
//     "type": "permabuy",
//     "undernames": 10
//   }
//   ...
// }
```

### `getPrescribedObservers({ evaluationOptions })`

Retrieves the prescribed observers of the ArIO contract. To fetch prescribed observers for a previous epoch set the `evaluationOptions` to the desired epoch.

```typescript
const arIO = new ArIO();
const observers = arIO.getPrescribedObservers();

// outputs:

// [
//   {
//     "gatewayAddress": "BpQlyhREz4lNGS-y3rSS1WxADfxPpAuing9Lgfdrj2U",
//     "observerAddress": "2Fk8lCmDegPg6jjprl57-UCpKmNgYiKwyhkU4vMNDnE",
//     "stake": 10000,
//     "start": 1296976,
//     "stakeWeight": 1,
//     "tenureWeight": 0.41453703703703704,
//     "gatewayRewardRatioWeight": 1,
//     "observerRewardRatioWeight": 1,
//     "compositeWeight": 0.41453703703703704,
//     "normalizedCompositeWeight": 0.0018972019546783507
//   },
//   ...
// ]

// observers from a previous epoch
const previousEpochObservers = arIO.getPrescribedObservers({
  evaluationOptions: {
    evalTo: { blockHeight: 1296975 }, // some block height from a previous epoch
  },
});

// [
//   {
//     "gatewayAddress": "2Ic0ZIpt85tjiVRaD_qoTSo9jgT7w0rbf4puSTRidcU",
//     "observerAddress": "2Ic0ZIpt85tjiVRaD_qoTSo9jgT7w0rbf4puSTRidcU",
//     "stake": 10000,
//     "start": 1292450,
//     "stakeWeight": 1,
//     "tenureWeight": 0.4494598765432099,
//     "gatewayRewardRatioWeight": 1,
//     "observerRewardRatioWeight": 1,
//     "compositeWeight": 0.4494598765432099,
//     "normalizedCompositeWeight": 0.002057032496835938
//   },
//   ...
// ]
```

## Developers

### Requirements

- `node>=v18.0.0`
- `npm` or `yarn`
- `docker` (recommended for testing)

### Setup & Build

- `nvm use` - use the correct node version
- `yarn install` - installs dependencies
- `yarn build` - builds web/node/bundled outputs

### Testing

- `yarn test:integration` - runs integration tests against a local [arns-service]
- `yarn example:web` - opens up the example web page
- `yarn example:cjs` - runs example CJS node script
- `yarn example:esm` - runs example ESM node script

### Linting & Formatting

- `yarn lint:check` - checks for linting errors
- `yarn lint:fix` - fixes linting errors
- `yarn format:check` - checks for formatting errors
- `yarn format:fix` - fixes formatting errors

### Architecture

- Code to interfaces.
- Prefer type safety over runtime safety.
- Prefer composition over inheritance.
- Prefer integration tests over unit tests.

For more information on how to contribute, please see [CONTRIBUTING.md].

<!-- ADD ALL LINK REFERENCES BELOW -->

[ar.io]: https://ar.io
[package.json]: ./package.json
[examples]: ./examples
[arns-service]: https://github.com/ar-io/arns-service
[CONTRIBUTING.md]: ./CONTRIBUTING.md
