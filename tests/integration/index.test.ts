import { ANT, ArweaveSigner, createAoSigner } from '@ar.io/sdk';
import { strict as assert } from 'node:assert';
import * as fs from 'node:fs';
import { describe, it } from 'node:test';

import { AO_LOADER_OPTIONS, LocalAO, TEST_AOS_ANT_WASM } from './utils';

const testWalletJSON = fs.readFileSync('./test-wallet.json', {
  encoding: 'utf-8',
});

const testWallet = JSON.parse(testWalletJSON);
const signers = [
  new ArweaveSigner(testWallet),
  createAoSigner(new ArweaveSigner(testWallet)),
] as const;

describe('integration esm tests', async () => {
  async function createLocalANT() {
    return LocalAO.init({
      wasmModule: TEST_AOS_ANT_WASM,
      aoLoaderOptions: AO_LOADER_OPTIONS,
    });
  }

  describe('ARIO', async () => {
    // TODO: add integration tests for ario
  });

  describe('ANT', async () => {
    describe('Reads', async () => {
      it('should be able to get ANT state', async () => {
        const ant = ANT.init({
          process: await createLocalANT(),
        });

        const state = await ant.getState();

        assert(state, 'unable to read ANT state');
      });
    });

    describe('Writes', async () => {
      it('should be able to set @ record', async () => {
        const ant = ANT.init({
          process: await createLocalANT(),
          signer: signers[0],
        });

        const res = await ant.setRecord({
          undername: '@',
          transactionId: ''.padEnd(43, '1'),
          ttlSeconds: 900,
        });

        assert(res, 'unable to set @ record');
      });
    });
  });
});
