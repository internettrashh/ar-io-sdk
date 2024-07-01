# @ar.io/sdk

[![codecov](https://codecov.io/gh/ar-io/ar-io-sdk/graph/badge.svg?token=7dXKcT7dJy)](https://codecov.io/gh/ar-io/ar-io-sdk)

This is the home of [ar.io] SDK. This SDK provides functionality for interacting with the ar.io ecosystem of services (e.g. gateways and observers) and protocols (e.g. ArNS and AO). It is available for both NodeJS and Web environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage](#usage)
  - [Web](#web)
  - [Node](#node)
  - [Typescript](#typescript)
- [IOToken & mIOToken](#iotoken--miotoken)
  - [Converting IO to mIO](#converting-io-to-mio)
- [ArIO Process](#ario-process)

  - [APIs](#apis)
    - [`init({ signer })`](#init-signer-)
    - [`getInfo()`](#getinfo)
    - [`getBalance({ address })`](#getbalance-address-)
    - [`getBalances()`](#getbalances)
    - [`getGateway({ address })`](#getgateway-address-)
    - [`getGateways()`](#getgateways)
    - [`getArNSRecord({ name })`](#getarnsrecord-name-)
    - [`getArNSRecords()`](#getarnsrecords)
    - [`getObservations({ epochIndex })`](#getobservations-epochindex-)
    - [`getDistributions({ epochIndex })`](#getdistributions-epochindex-)
    - [`getEpoch({ epochIndex })`](#getepoch-epochindex-)
    - [`getCurrentEpoch()`](#getcurrentepoch)
    - [`getPrescribedObservers({ epochIndex })`](#getprescribedobservers-epochindex-)
    - [`joinNetwork(params)`](#joinnetworkparams)
    - [`updateGatewaySettings(gatewaySettings)`](#updategatewaysettingsgatewaysettings)
    - [`increaseDelegateStake({ target, qty })`](#increasedelegatestake-target-qty-)
    - [`decreaseDelegateStake({ target, qty })`](#decreasedelegatestake-target-qty-)
    - [`increaseOperatorStake({ qty })`](#increaseoperatorstake-qty-)
    - [`decreaseOperatorStake({ qty })`](#decreaseoperatorstake-qty-)
    - [`saveObservations({ reportTxId, failedGateways })`](#saveobservations-reporttxid-failedgateways-)
    - [`transfer({ target, qty, denomination })`](#transfer-target-qty-denomination-)
  - [Custom Processes](#custom-processes)

- [Arweave Name Tokens (ANT's)](#arweave-name-tokens-ants)
  - [APIs](#apis-1)
    - [`init({ signer: new ArweaveSigner(jwk) })`](#init-signer-)
    - [`getInfo()`](#getinfo)
    - [`getOwner()`](#getowner)
    - [`getControllers()`](#getcontrollers)
    - [`getRecords()`](#getrecords)
    - [`transfer({ target })`](#transfer-target-)
    - [`setController({ controller })`](#setcontroller-controller-)
    - [`removeController({ controller })`](#removecontroller-controller-)
    - [`setRecord({ undername, transactionId, ttlSeconds })`](#setrecord-undername-transactionid-ttlseconds-)
    - [`removeRecord({ undername })`](#removerecord-undername-)
    - [`setName({ name })`](#setname-name-)
    - [`setTicker({ ticker })`](#setticker-ticker-)
  - [Configuration](#configuration)
- [Developers](#developers)
  - [Requirements](#requirements)
  - [Setup \& Build](#setup--build)
  - [Testing](#testing)
  - [Linting \& Formatting](#linting--formatting)
  - [Architecture](#architecture)

## Prerequisites

- `node>=v18.0.0`
- `npm` or `yarn`

## Installation

```shell
npm install @ar.io/sdk
```

or

```shell
yarn add @ar.io/sdk
```

## Quick Start

```typescript
import { IO } from '@ar.io/sdk';

const io = IO.init();
const gateways = await io.getGateways();
```

<details>
  <summary>Output</summary>

```json
{
  "QGWqtJdLLgm2ehFWiiPzMaoFLD50CnGuzZIPEdoDRGQ": {
    "end": 0,
    "observerWallet": "IPdwa3Mb_9pDD8c2IaJx6aad51Ss-_TfStVwBuhtXMs",
    "operatorStake": 250000000000, // value in mIO
    "settings": {
      "fqdn": "ar-io.dev",
      "label": "AR.IO Test",
      "note": "Test Gateway operated by PDS for the AR.IO ecosystem.",
      "port": 443,
      "properties": "raJgvbFU-YAnku-WsupIdbTsqqGLQiYpGzoqk9SCVgY",
      "protocol": "https"
    },
    "start": 1256694,
    "stats": {
      "failedConsecutiveEpochs": 0,
      "passedEpochCount": 30,
      "submittedEpochCount": 30,
      "totalEpochParticipationCount": 31,
      "totalEpochsPrescribedCount": 31
    },
    "status": "joined",
    "vaults": {},
    "weights": {
      "stakeWeight": 25,
      "tenureWeight": 0.9031327160493827,
      "gatewayRewardRatioWeight": 0.96875,
      "observerRewardRatioWeight": 0.96875,
      "compositeWeight": 21.189222170982834,
      "normalizedCompositeWeight": 0.27485583057217183
    }
  }
}
```

</details>

## Usage

The SDK is provided in both CommonJS and ESM formats and is compatible with bundlers such as Webpack, Rollup, and ESbuild. Utilize the appropriately named exports provided by this SDK's [package.json] based on your project's configuration. Refer to the [examples] directory to see how to use the SDK in various environments.

### Web

#### Bundlers (Webpack, Rollup, ESbuild, etc.)

```javascript
import { IO } from '@ar.io/sdk';

// set up client
const io = IO.init();
// fetch gateways
const gateways = await io.getGateways();
```

> _**Note**: polyfills are only provided when using the named `@ar.io/sdk/web` export (which requires `moduleResolution: nodenext` in `tsconfig.json`). If you are using the default export within a Typescript project (e.g. `moduleResolution: node`), you will need to provide your own polyfills - specifically `crypto`, `fs` and `buffer`. Refer to [examples/webpack] and [examples/vite] for references in how to properly provide those polyfills. For other project configurations, refer to your bundler's documentation for more information on how to provide the necessary polyfills._

#### Browser

```html
<script type="module">
  import { IO } from 'https://unpkg.com/@ar.io/sdk';

  // set up client
  const io = IO.init();
  // fetch gateways
  const gateways = await io.getGateways();
</script>
```

### Node

#### ESM (NodeNext)

```javascript
import { IO } from '@ar.io/sdk/node';

// set up client
const io = IO.init();
// fetch gateways
const gateways = await io.getGateways();
```

#### CJS

```javascript
import { IO } from '@ar.io/sdk';

// set up client
const io = IO.init();
// fetch gateways
const gateways = await io.getGateways();
```

### Typescript

The SDK provides TypeScript types. When you import the SDK in a TypeScript project types are exported from `./lib/types/[node/web]/index.d.ts` and should be automatically recognized by package managers, offering benefits such as type-checking and autocompletion.

## IOToken & mIOToken

The ArIO process stores all values as mIO (milli-IO) to avoid floating-point arithmetic issues. The SDK provides an `IOToken` and `mIOToken` classes to handle the conversion between IO and mIO, along with rounding logic for precision.

**All process interactions expect values in mIO. If numbers are provided as inputs, they are assumed to be in raw mIO values.**

### Converting IO to mIO

```typescript
import { IOToken, mIOToken } from '@ar.io/sdk';

const ioValue = 1;
const mIOValue = new IOToken(ioValue).toMIO();
console.log(mIOValue); // 1000000 (mIO)

const mIOValue = 1_000_000;
const ioValue = new mIOToken(mIOValue).toIO();
console.log(ioValue); // 1 (IO)
```

## ArIO Process

### APIs

#### `init({ signer })`

Factory function to that creates a read-only or writeable client. By providing a `signer` additional write APIs that require signing, like `joinNetwork` and `delegateStake` are available. By default, a read-only client is returned and no write APIs are available.

```typescript
// read-only client that has access to all read APIs
const ioReadable = IO.init()

const arweave = Arweave.init({
  host: 'ar-io.dev',
  port: 443,
  protocol: 'https'
})
// for browser environments
const browserSigner = new ArConnectSigner(window.arweaveWallet, arweave);
const ioWriteable = IO.init({ signer: browserSigner});

// for node environments
const nodeSigner = new ArweaveSigner(JWK);
const ioWriteable = IO.init({ signer: nodeSigner});

```

#### `getInfo()`

Retrieves the information of the ArIO process.

```typescript
const io = IO.init();
const info = await io.getInfo();
```

<details>
  <summary>Output</summary>

```json
{
  "name": "Testnet IO",
  "ticker": "tIO",
  "owner": "QGWqtJdLLgm2ehFWiiPzMaoFLD50CnGuzZIPEdoDRGQ",
  "denomination": "IO"
}
```

</details>

#### `getBalance({ address })`

Retrieves the balance of the specified wallet address.

```typescript
const io = IO.init();
// the balance will be returned in mIO as a value
const balance = await io
  .getBalance({
    address: 'INSERT_WALLET_ADDRESS',
  })
  .then((balance) => new mIOToken().toIO());

console.log(balance.valueOf());
```

<details>
  <summary>Output</summary>

```json
// value in IO
1_000_000
```

</details>

#### `getBalances()`

Retrieves the balances of the ArIO process in `mIO`

<!--
// ALM - A part of me wonders whether streaming JSON might be beneficial in the future
// and if providing streaming versions of these APIs will scale nicely longer term, e.g.
// io.streamBalances({ sortingCriteria: BALANCE_DESC });
 -->

```typescript
const io = IO.init();
const balances = await io.getBalances();
```

<details>
  <summary>Output</summary>

```json
{
  "-4xgjroXENKYhTWqrBo57HQwvDL51mMvSxJy6Y2Z_sA": 5000000000, // value in mIO
  "-7vXsQZQDk8TMDlpiSLy3CnLi5PDPlAaN2DaynORpck": 5000000000, // value in mIO
  "-9JU3W8g9nOAB1OrJQ8FxkaWCpv5slBET2HppTItbmk": 5000000000 // value in mIO
}
```

</details>

#### `getGateway({ address })`

Retrieves a gateway's info by its staking wallet address.

```typescript
const io = IO.init();
const gateway = await io.getGateway({
  address: 'INSERT_GATEWAY_ADDRESS',
});
```

<details>
  <summary>Output</summary>

```json
{
  "end": 0,
  "observerWallet": "IPdwa3Mb_9pDD8c2IaJx6aad51Ss-_TfStVwBuhtXMs",
  "operatorStake": 250000000000, // value in mIO
  "settings": {
    "fqdn": "ar-io.dev",
    "label": "AR.IO Test",
    "note": "Test Gateway operated by PDS for the AR.IO ecosystem.",
    "port": 443,
    "properties": "raJgvbFU-YAnku-WsupIdbTsqqGLQiYpGzoqk9SCVgY",
    "protocol": "https"
  },
  "start": 1256694,
  "stats": {
    "failedConsecutiveEpochs": 0,
    "passedEpochCount": 30,
    "submittedEpochCount": 30,
    "totalEpochParticipationCount": 31,
    "totalEpochsPrescribedCount": 31
  },
  "status": "joined",
  "vaults": {}
}
```

</details>

#### `getGateways()`

Retrieves the registered gateways of the ArIO process.

```typescript
const io = IO.init();
const gateways = await io.getGateways();
```

<details>
  <summary>Output</summary>

```json
{
  "QGWqtJdLLgm2ehFWiiPzMaoFLD50CnGuzZIPEdoDRGQ": {
    "end": 0,
    "observerWallet": "IPdwa3Mb_9pDD8c2IaJx6aad51Ss-_TfStVwBuhtXMs",
    "operatorStake": 250000000000, // value in mIO
    "settings": {
      "fqdn": "ar-io.dev",
      "label": "AR.IO Test",
      "note": "Test Gateway operated by PDS for the AR.IO ecosystem.",
      "port": 443,
      "properties": "raJgvbFU-YAnku-WsupIdbTsqqGLQiYpGzoqk9SCVgY",
      "protocol": "https"
    },
    "start": 1256694,
    "stats": {
      "failedConsecutiveEpochs": 0,
      "passedEpochCount": 30,
      "submittedEpochCount": 30,
      "totalEpochParticipationCount": 31,
      "totalEpochsPrescribedCount": 31
    },
    "status": "joined",
    "vaults": {}
  }
}
```

</details>

#### `getArNSRecord({ name })`

Retrieves the record info of the specified ArNS name.

```typescript
const io = IO.init();
const record = await io.getArNSRecord({ name: 'ardrive' });
```

<details>
  <summary>Output</summary>

```json
{
  "processId": "bh9l1cy0aksiL_x9M359faGzM_yjralacHIUo8_nQXM",
  "endTimestamp": 1711122739,
  "startTimestamp": 1694101828,
  "type": "lease",
  "undernames": 100
}
```

</details>

#### `getArNSRecords()`

Retrieves all registered ArNS records of the ArIO process.

```typescript
const io = IO.init();
const records = await io.getArNSRecords();
```

<details>
  <summary>Output</summary>

```json
{
  "ardrive": {
    "processId": "bh9l1cy0aksiL_x9M359faGzM_yjralacHIUo8_nQXM",
    "endTimestamp": 1711122739,
    "startTimestamp": 1694101828,
    "type": "lease",
    "undernames": 100
  },
  "ar-io": {
    "processId": "eNey-H9RB9uCdoJUvPULb35qhZVXZcEXv8xds4aHhkQ",
    "purchasePrice": 75541282285, // value in mIO
    "startTimestamp": 1706747215,
    "type": "permabuy",
    "undernames": 10
  }
}
```

</details>

#### `getObservations({ epochIndex })`

Returns the epoch-indexed observation list.

```typescript
const io = IO.init();
const observations = await io.getObservations();
```

<details>
  <summary>Output</summary>

```json
{
  "0": {
    "failureSummaries": {
      "-Tk2DDk8k4zkwtppp_XFKKI5oUgh6IEHygAoN7mD-w8": [
        "Ie2wEEUDKoU26c7IuckHNn3vMFdNQnMvfPBrFzAb3NA",
        "Ie2wEEUDKoU26c7IuckHNn3vMFdNQnMvfPBrFzAb3NA"
      ]
    },
    "reports": {
      "IPdwa3Mb_9pDD8c2IaJx6aad51Ss-_TfStVwBuhtXMs": "B6UUjKWjjEWDBvDSMXWNmymfwvgR9EN27z5FTkEVlX4",
      "Ie2wEEUDKoU26c7IuckHNn3vMFdNQnMvfPBrFzAb3NA": "7tKsiQ2fxv0D8ZVN_QEv29fZ8hwFIgHoEDrpeEG0DIs",
      "osZP4D9cqeDvbVFBaEfjIxwc1QLIvRxUBRAxDIX9je8": "aatgznEvC_UPcxp1v0uw_RqydhIfKm4wtt1KCpONBB0",
      "qZ90I67XG68BYIAFVNfm9PUdM7v1XtFTn7u-EOZFAtk": "Bd8SmFK9-ktJRmwIungS8ur6JM-JtpxrvMtjt5JkB1M"
    }
  }
}
```

</details>

#### `getDistributions({ epochIndex })`

Returns the current rewards distribution information. The resulting object is pruned, to get older distributions use the `evaluationOptions` to `evalTo` a previous state.

```typescript
const io = IO.init();
const distributions = await io.getDistributions();
```

<details>
  <summary>Output</summary>

```json
{
  "epochEndHeight": 1382379,
  "epochPeriod": 43,
  "epochStartHeight": 1381660,
  "epochZeroStartHeight": 1350700,
  "nextDistributionHeight": 1382394
}
```

</details>

#### `getEpoch({ epochIndex })`

Returns the epoch data for the specified block height.

```typescript
const io = IO.init();
const epoch = await io.getEpoch({ epochIndex: 0 });
```

<details>
  <summary>Output</summary>

```json
{
  "epochIndex": 0,
  "startTimestamp": 1694101828,
  "endTimestamp": 1711122739,
  "startHeight": 1350700,
  "distributionTimestamp": 1711122739,
  "observations": {
    "failureSummaries": {
      "-Tk2DDk8k4zkwtppp_XFKKI5oUgh6IEHygAoN7mD-w8": [
        "Ie2wEEUDKoU26c7IuckHNn3vMFdNQnMvfPBrFzAb3NA"
      ]
    },
    "reports": {
      "IPdwa3Mb_9pDD8c2IaJx6aad51Ss-_TfStVwBuhtXMs": "B6UUjKWjjEWDBvDSMXWNmymfwvgR9EN27z5FTkEVlX4"
    }
  },
  "prescribedNames": ["ardrive", "ar-io", "arweave", "fwd", "ao"],
  "prescribedObservers": [
    {
      "gatewayAddress": "2Fk8lCmDegPg6jjprl57-UCpKmNgYiKwyhkU4vMNDnE",
      "observerAddress": "2Fk8lCmDegPg6jjprl57-UCpKmNgYiKwyhkU4vMNDnE",
      "stake": 10000000000, // value in mIO
      "start": 1292450,
      "stakeWeight": 1,
      "tenureWeight": 0.4494598765432099,
      "gatewayRewardRatioWeight": 1,
      "observerRewardRatioWeight": 1,
      "compositeWeight": 0.4494598765432099,
      "normalizedCompositeWeight": 0.002057032496835938
    }
  ],
  "distributions": {
    "distributedTimestamp": 1711122739,
    "totalEligibleRewards": 100000000,
    "rewards": {
      "IPdwa3Mb_9pDD8c2IaJx6aad51Ss-_TfStVwBuhtXMs": 100000000
    }
  }
}
```

</details>

#### `getCurrentEpoch()`

Returns the current epoch data.

```typescript
const io = IO.init();
const epoch = await io.getCurrentEpoch();
```

<details>
  <summary>Output</summary>

```json
{
  "epochIndex": 0,
  "startTimestamp": 1694101828,
  "endTimestamp": 1711122739,
  "startHeight": 1350700,
  "distributionTimestamp": 1711122739,
  "observations": {
    "failureSummaries": {
      "-Tk2DDk8k4zkwtppp_XFKKI5oUgh6IEHygAoN7mD-w8": [
        "Ie2wEEUDKoU26c7IuckHNn3vMFdNQnMvfPBrFzAb3NA"
      ]
    },
    "reports": {
      "IPdwa3Mb_9pDD8c2IaJx6aad51Ss-_TfStVwBuhtXMs": "B6UUjKWjjEWDBvDSMXWNmymfwvgR9EN27z5FTkEVlX4"
    }
  },
  "prescribedNames": ["ardrive", "ar-io", "arweave", "fwd", "ao"],
  "prescribedObservers": [
    {
      "gatewayAddress": "2Fk8lCmDegPg6jjprl57-UCpKmNgYiKwyhkU4vMNDnE",
      "observerAddress": "2Fk8lCmDegPg6jjprl57-UCpKmNgYiKwyhkU4vMNDnE",
      "stake": 10000000000, // value in mIO
      "start": 1292450,
      "stakeWeight": 1,
      "tenureWeight": 0.4494598765432099,
      "gatewayRewardRatioWeight": 1,
      "observerRewardRatioWeight": 1,
      "compositeWeight": 0.4494598765432099,
      "normalizedCompositeWeight": 0.002057032496835938
    }
  ],
  "distributions": {
    "distributedTimestamp": 1711122739,
    "totalEligibleRewards": 100000000,
    "rewards": {
      "IPdwa3Mb_9pDD8c2IaJx6aad51Ss-_TfStVwBuhtXMs": 100000000
    }
  }
}
```

</details>

#### `getPrescribedObservers({ epochIndex })`

Retrieves the prescribed observers of the ArIO process. To fetch prescribed observers for a previous epoch set the `evaluationOptions` to the desired epoch.

```typescript
const io = IO.init();
const observers = await io.getPrescribedObservers({ epochIndex: 0 });
```

<details>
<summary>Output</summary>

```json
[
  {
    "gatewayAddress": "BpQlyhREz4lNGS-y3rSS1WxADfxPpAuing9Lgfdrj2U",
    "observerAddress": "2Fk8lCmDegPg6jjprl57-UCpKmNgYiKwyhkU4vMNDnE",
    "stake": 10000000000, // value in mIO
    "start": 1296976,
    "stakeWeight": 1,
    "tenureWeight": 0.41453703703703704,
    "gatewayRewardRatioWeight": 1,
    "observerRewardRatioWeight": 1,
    "compositeWeight": 0.41453703703703704,
    "normalizedCompositeWeight": 0.0018972019546783507
  }
]
```

</details>

#### `getTokenCost({ intent, ...args })`

Calculates the price in mIO to perform the interaction in question, eg a 'buyRecord' interaction, where payload is the specific params for that interaction.

```typescript
const price = await io
  .getTokenCost({
    intent: 'Buy-Record',
    name: 'ar-io',
    type: 'permabuy',
  })
  .then((p) => new mIOToken(p).toIO());
// Price is returned as mio, convert to IO and log it out
console.log({ price: price.valueOf() });
```

<details>
  <summary>Output</summary>

```json
{ "price": 1642.62 }
```

</details>

#### `joinNetwork(params)`

Joins a gateway to the ar.io network via its associated wallet. Requires `signer` to be provided on `IO.init` to sign the transaction.

```typescript
const joinNetworkParams = {
  qty: new IOToken(10_000).toMIO(), // minimum operator stake allowed
  autoStake: true, // auto-stake operator rewards to the gateway
  allowDelegatedStaking: true, // allows delegated staking
  minDelegatedStake: new IOToken(100).toMIO(), // minimum delegated stake allowed
  delegateRewardShareRatio: 10, // percentage of rewards to share with delegates (e.g. 10%)
  label: 'john smith', // min 1, max 64 characters
  note: 'The example gateway', // max 256 characters
  properties: 'FH1aVetOoulPGqgYukj0VE0wIhDy90WiQoV3U2PeY44', // Arweave transaction ID containing additional properties of the Gateway
  observerWallet: '0VE0wIhDy90WiQoV3U2PeY44FH1aVetOoulPGqgYukj', // wallet address of the observer, must match OBSERVER_WALLET on the observer
  fqdn: 'example.com', // fully qualified domain name - note: you must own the domain and set the OBSERVER_WALLET on your gateway to match `observerWallet`
  port: 443, // port number
  protocol: 'https', // only 'https' is supported
};

const io = IO.init({ signer: new ArweaveSigner(jwk) });
const { id: txId } = await io.joinNetwork(
  joinNetworkParams,
  // optional additional tags
  { tags: [{ name: 'App-Name', value: 'My-Awesome-App' }] },
);
```

#### `updateGatewaySettings(gatewaySettings)`

Writes new gateway settings to the callers gateway configuration. Requires `signer` to be provided on `IO.init` to sign the transaction.

```typescript
const updateGatewaySettingsParams = {
  minDelegatedStake: new IOToken(100).toMIO(),
};

const io = IO.init({ signer: new ArweaveSigner(jwk) });
const { id: txId } = await io.updateGatewaySettings(
  updateGatewaySettingsParams,
  // optional additional tags
  { tags: [{ name: 'App-Name', value: 'My-Awesome-App' }] },
);
```

#### `increaseDelegateStake({ target, qty })`

Increases the callers stake on the target gateway. Requires `signer` to be provided on `IO.init` to sign the transaction.

```typescript
const params = {
  target: 't4Xr0_J4Iurt7caNST02cMotaz2FIbWQ4Kbj616RHl3',
  qty: new IOToken(100).toMIO(),
};

const io = IO.init({ signer: new ArweaveSigner(jwk) });
const { id: txId } = await io.increaseDelegateStake(
  params,
  // optional additional tags
  { tags: [{ name: 'App-Name', value: 'My-Awesome-App' }] },
);
```

#### `decreaseDelegateStake({ target, qty })`

Decreases the callers stake on the target gateway. Requires `signer` to be provided on `IO.init` to sign the transaction.

```typescript

const io = IO.init({ signer: new ArweaveSigner(jwk) });
const { id: txId } = await io.decreaseDelegateStake({
  {
  target: 't4Xr0_J4Iurt7caNST02cMotaz2FIbWQ4Kbj616RHl3',
  qty: new IOToken(100).toMIO(),
};
}, {
  tags: [{ name: 'App-Name', value: 'My-Awesome-App' }],
});
```

#### `increaseOperatorStake({ qty })`

Increases the callers operator stake. Must be executed with a wallet registered as a gateway operator. Requires `signer` to be provided on `IO.init` to sign the transaction.

```typescript
const io = IO.init({ signer: new ArweaveSigner(jwk) });
const { id: txId } = await io.increaseOperatorStake(
  {
    qty: new IOToken(100).toMIO(),
  },
  {
    tags: [{ name: 'App-Name', value: 'My-Awesome-App' }],
  },
);
```

#### `decreaseOperatorStake({ qty })`

Decreases the callers operator stake. Must be executed with a wallet registered as a gateway operator. Requires `signer` to be provided on `IO.init` to sign the transaction.

```typescript
const io = IO.init({ signer: new ArweaveSigner(jwk) });
const { id: txId } = await io.decreaseOperatorStake(
  {
    qty: new IOToken(100).toMIO(),
  },
  {
    tags: [{ name: 'App-Name', value: 'My-Awesome-App' }],
  },
);
```

#### `saveObservations({ reportTxId, failedGateways })`

Saves the observations of the current epoch. Requires `signer` to be provided on `IO.init` to sign the transaction.

```typescript
const io = IO.init({ signer: new ArweaveSigner(jwk) });
const { id: txId } = await io.saveObservations(
  {
    reportTxId: 'fDrr0_J4Iurt7caNST02cMotaz2FIbWQ4Kcj616RHl3',
    failedGateways: ['t4Xr0_J4Iurt7caNST02cMotaz2FIbWQ4Kbj616RHl3'],
  },
  {
    tags: [{ name: 'App-Name', value: 'My-Awesome-App' }],
  },
);
```

#### `transfer({ target, qty, denomination })`

Transfers `IO` or `mIO` depending on the `denomination` selected, defaulting as `IO`, to the designated `target` recipient address. Requires `signer` to be provided on `IO.init` to sign the transaction.

```typescript
const io = IO.init({ signer: new ArweaveSigner(jwk) });
const { id: txId } = await io.transfer(
  {
    target: '-5dV7nk7waR8v4STuwPnTck1zFVkQqJh5K9q9Zik4Y5',
    qty: new IOToken(1000).toMIO(),
    denomination: 'IO',
  },
  // optional additional tags
  { tags: [{ name: 'App-Name', value: 'My-Awesome-App' }] },
);
```

#### `increaseUndernameLimit({ name, qty })`

Increases the undername support of a domain up to a maximum of 10k. Domains, by default, support up to 10 undernames.

```typescript
const io = IO.init({ signer: new ArweaveSigner(jwk) });
const { id: txId } = await io.increaseUndernameLimit(
  {
    name: 'ar-io',
    qty: 420,
  },
  // optional additional tags
  { tags: [{ name: 'App-Name', value: 'My-Awesome-App' }] },
);
```

#### `extendLease({ name, years })`

Extends the lease of a registered ArNS domain, with an extension of 1-5 years depending on grace period status. Permanently registered domains cannot be extended.

```typescript
const io = IO.init({ signer: new ArweaveSigner(jwk) });
const { id: txId } = await io.extendLease(
  {
    name: 'ar-io',
    years: 1,
  },
  // optional additional tags
  { tags: [{ name: 'App-Name', value: 'My-Awesome-App' }] },
);
```

### Custom Processes

The ArIO client class exposes APIs relevant to the ar.io process. It can be configured to use any AO Process ID that adheres to the spec of the ar.io process. In the default case, it will automatically build and utilize a process data provider interface that is configured to point the the known ar.io mainnet process ID at construction time. You can provide custom process data provider or, alternatively, a `processId` to the ArIO constructor to use a different, ar.io-spec-compatible process.

```typescript
// provide a custom processId to the client and default to remote evaluation
const remoteCustomArIO = IO.init({
  processId: 'TESTNET_PROCESS_ID',
});
```

## Arweave Name Tokens (ANT's)

The ANT client class exposes APIs relevant to compliant Arweave Name Token processes. It can be configured to use any process ID that adheres to the ANT process spec. You must provide either a custom process data provider or a processId to the ANT class constructor to use.

### APIs

#### `init({ signer: new ArweaveSigner(jwk) })`

Factory function to that creates a read-only or writeable client. By providing a `signer` additional write APIs that require signing, like `setRecord` and `transfer` are available. By default, a read-only client is returned and no write APIs are available.

```typescript
const arweave = Arweave.init({
  host: 'ar-io.dev',
  port: 443,
  protocol: 'https'
})
// in a browser environment with ArConnect
const browserSigner = new ArConnectSigner(window.arweaveWallet, arweave);
const ant = ANT.init({
  signer: browserSigner,
  processId: 'bh9l1cy0aksiL_x9M359faGzM_yjralacHIUo8_nQXM'
});

// in a node environment
const nodeSigner = new ArweaveSigner(JWK);
const ant = ANT.init({
  signer: nodeSigner,
  processId: 'bh9l1cy0aksiL_x9M359faGzM_yjralacHIUo8_nQXM'
});

```

#### `getInfo()`

Retrieves the information of the ANT process.

```typescript
const ant = ANT.init({
  processId: 'bh9l1cy0aksiL_x9M359faGzM_yjralacHIUo8_nQXM',
});
const info = await ant.getInfo();
```

<details>
  <summary>Output</summary>

```json
{
  "name": "Ardrive",
  "ticker": "ANT-ARDRIVE",
  "owner": "QGWqtJdLLgm2ehFWiiPzMaoFLD50CnGuzZIPEdoDRGQ"
}
```

</details>

#### `getOwner()`

Returns the owner of the configured ANT process.

```typescript
const ant = ANT.init({
  processId: 'bh9l1cy0aksiL_x9M359faGzM_yjralacHIUo8_nQXM',
});
const owner = await ant.getOwner();
```

<details>
  <summary>Output</summary>

```json
"ccp3blG__gKUvG3hsGC2u06aDmqv4CuhuDJGOIg0jw4"
```

</details>

#### `getControllers()`

Returns the controllers of the configured ANT process.

```typescript
const ant = ANT.init({
  processId: 'bh9l1cy0aksiL_x9M359faGzM_yjralacHIUo8_nQXM',
});
const controllers = await ant.getControllers();
```

<details>
  <summary>Output</summary>

```json
["ccp3blG__gKUvG3hsGC2u06aDmqv4CuhuDJGOIg0jw4"]
```

</details>

#### `getRecords()`

Returns all records on the configured ANT process, including the required `@` record that resolve connected ArNS names.

```typescript
const ant = ANT.init({
  processId: 'bh9l1cy0aksiL_x9M359faGzM_yjralacHIUo8_nQXM',
});
const records = await ant.getRecords();
```

<details>
  <summary>Output</summary>

```json
{
  "@": {
    "transactionId": "nOXJjj_vk0Dc1yCgdWD8kti_1iHruGzLQLNNBHVpN0Y",
    "ttlSeconds": 3600
  },
  "cn": {
    "transactionId": "_HquerT6pfGFXrVxRxQTkJ7PV5RciZCqvMjLtUY0C1k",
    "ttlSeconds": 3300
  },
  "dapp": {
    "transactionId": "hxlxVgAG0K4o3fVD9T6Q4VBWpPmMZwMWgRh1kcuh3WU",
    "ttlSeconds": 3600
  },
  "logo": {
    "transactionId": "KKmRbIfrc7wiLcG0zvY1etlO0NBx1926dSCksxCIN3A",
    "ttlSeconds": 3600
  },
  "og": {
    "transactionId": "YzD_Pm5VAfYpMD3zQCgMUcKKuleGhEH7axlrnrDCKBo",
    "ttlSeconds": 3600
  },
  "og_dapp": {
    "transactionId": "5iR4wBu4KUV1pUz1YpYE1ARXSRHUT5G2ptMuoN2JDlI",
    "ttlSeconds": 3600
  },
  "og_logo": {
    "transactionId": "TB2wJyKrPnkAW79DAwlJYwpgdHKpijEJWQfcwX715Co",
    "ttlSeconds": 3600
  }
}
```

</details>

#### `transfer({ target })`

Transfers ownership of the ANT to a new target address. Target MUST be an Arweave address.

```typescript
const ant = ANT.init({
  processId: 'bh9l1cy0aksiL_x9M359faGzM_yjralacHIUo8_nQXM',
});
const recipient = 'aGzM_yjralacHIUo8_nQXMbh9l1cy0aksiL_x9M359f';
const { id: txId } = await ant.transfer(
  { target: recipient },
  // optional additional tags
  { tags: [{ name: 'App-Name', value: 'My-Awesome-App' }] },
);
```

#### `setController({ controller })`

Adds a new controller to the list of approved controllers on the ANT. Controllers can set records and change the ticker and name of the ANT process.

```typescript
const ant = ANT.init({
  processId: 'bh9l1cy0aksiL_x9M359faGzM_yjralacHIUo8_nQXM',
});
const controller = 'aGzM_yjralacHIUo8_nQXMbh9l1cy0aksiL_x9M359f';
const { id: txId } = await ant.setController(
  { controller },
  // optional additional tags
  { tags: [{ name: 'App-Name', value: 'My-Awesome-App' }] },
);
```

#### `removeController({ controller })`

Removes a controller from the list of approved controllers on the ANT.

```typescript
const ant = ANT.init({
  processId: 'bh9l1cy0aksiL_x9M359faGzM_yjralacHIUo8_nQXM',
});
const controller = 'aGzM_yjralacHIUo8_nQXMbh9l1cy0aksiL_x9M359f';
const { id: txId } = await ant.removeController(
  { controller },
  // optional additional tags
  { tags: [{ name: 'App-Name', value: 'My-Awesome-App' }] },
);
```

#### `setRecord({ undername, transactionId, ttlSeconds })`

Updates or creates a record in the ANT process.

> Records, or `undernames` are configured with the `transactionId` - the arweave transaction id the record resolves - and `ttlSeconds`, the Time To Live in the cache of client applications.

```typescript
const ant = ANT.init({
  processId: 'bh9l1cy0aksiL_x9M359faGzM_yjralacHIUo8_nQXM',
});
const undername = '@'; // the root record
const transactionId = '432l1cy0aksiL_x9M359faGzM_yjralacHIUo8_nQXM';
const ttlSeconds = 900;
const { id: txId } = await ant.setRecord(
  {
    undername: subDomain,
    transactionId,
    ttlSeconds,
  },
  // optional additional tags
  { tags: [{ name: 'App-Name', value: 'My-Awesome-App' }] },
);
```

#### `removeRecord({ undername })`

Removes a record from the ANT process.

```typescript
const ant = ANT.init({
  processId: 'bh9l1cy0aksiL_x9M359faGzM_yjralacHIUo8_nQXM',
});
const undername = 'test-domain';
const { id: txId } = await ant.removeRecord(
  { undername },
  // optional additional tags
  { tags: [{ name: 'App-Name', value: 'My-Awesome-App' }] },
);
```

#### `setName({ name })`

Sets the name of the ANT process.

```typescript
const ant = ANT.init({
  processId: 'bh9l1cy0aksiL_x9M359faGzM_yjralacHIUo8_nQXM',
});
const name = 'chumbawumba';
const { id: txId } = await ant.setName(
  { name },
  // optional additional tags
  { tags: [{ name: 'App-Name', value: 'My-Awesome-App' }] },
);
```

#### `setTicker({ ticker })`

Sets the ticker of the ANT process.

```typescript
const ant = ANT.init({
  processId: 'bh9l1cy0aksiL_x9M359faGzM_yjralacHIUo8_nQXM',
});
const ticker = 'ANT-WUMBA';
const { id: txId } = await ant.setTicker(
  { ticker },
  { tags: [{ name: 'App-Name', value: 'My-Awesome-App' }] },
);
```

### Configuration

ANT clients can be configured to use custom AO process. Refer to [AO Connect] for more information on how to configure the client.

```typescript

const ant = ANT.init({
  process: new AoProcess({
    processId: 'ANT_PROCESS_ID'
    ao: connect({
      MU_URL: 'https://mu-testnet.xyz',
      CU_URL: 'https://cu-testnet.xyz',
      GRAPHQL_URL: 'https://arweave.net/graphql',
      GATEWAY_URL: 'https://arweave.net',
    })
  })
});
```

## Developers

### Requirements

- `node` >= 18.0.0
- `npm` or `yarn`
- `docker` (recommended for testing)

### Setup & Build

- `nvm use` - use the correct node version
- `yarn install` - installs dependencies
- `yarn build` - builds web/node/bundled outputs

### Testing

- `yarn test:integration` - runs integration tests against a local AO testnet
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
[examples/webpack]: ./examples/webpack
[examples/vite]: ./examples/vite
[CONTRIBUTING.md]: ./CONTRIBUTING.md
[AO Connect]: https://github.com/permaweb/ao/tree/main/connect
