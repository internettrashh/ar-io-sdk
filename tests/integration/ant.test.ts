import { ArweaveSigner } from 'arbundles';

import { ANT, ANTReadable } from '../../src/common/ant';
import { RemoteContract } from '../../src/common/contracts/remote-contract';
import { WarpContract } from '../../src/common/contracts/warp-contract';
import { DefaultLogger } from '../../src/common/logger';
import { ANTState } from '../../src/contract-state';
import {
  arweave,
  evaluateToBlockHeight,
  evaluateToSortKey,
} from '../constants';

const contractTxId = 'UC2zwawQoTnh0TNd9mYLQS4wObBBeaOU5LPQTNETqA4';
const localCacheUrl = `https://api.arns.app`;

const testCases = [
  [{ sortKey: evaluateToSortKey.toString() }],
  [{ blockHeight: evaluateToBlockHeight }],
  [undefined],
] as const;

describe('ANT contract apis', () => {
  const ant = ANT.init({
    contract: new RemoteContract<ANTState>({
      cacheUrl: localCacheUrl,
      contractTxId,
      logger: new DefaultLogger({ level: 'none' }),
    }),
  });

  it('should connect and return a valid instance', async () => {
    expect(ant).toBeInstanceOf(ANTReadable);
  });

  it.each(testCases)(
    `should get contract state with evaluation options: ${JSON.stringify('%s')}`,
    async (evalTo) => {
      const state = await ant.getState({ evaluationOptions: { evalTo } });
      expect(state).toBeDefined();
    },
  );

  it.each(testCases)(
    `should get record: ${JSON.stringify('%s')}`,
    async (evalTo) => {
      const record = await ant.getRecord({
        domain: '@',
        evaluationOptions: { evalTo },
      });
      expect(record).toBeDefined();
    },
  );

  it.each(testCases)(
    `should get records with evaluation options: ${JSON.stringify('%s')}`,
    async (evalTo) => {
      const records = await ant.getRecords({ evaluationOptions: { evalTo } });
      expect(records).toBeDefined();
    },
  );

  it.each(testCases)(
    `should get owner with evaluation options: ${JSON.stringify('%s')}`,
    async (evalTo) => {
      const owner = await ant.getOwner({ evaluationOptions: { evalTo } });
      expect(owner).toBeDefined();
    },
  );

  it.each(testCases)(
    `should get controllers with evaluation options: ${JSON.stringify('%s')}`,
    async (evalTo) => {
      const controllers = await ant.getControllers({
        evaluationOptions: { evalTo },
      });
      expect(controllers).toBeDefined();
    },
  );

  it.each(testCases)(
    `should get name with evaluation options: ${JSON.stringify('%s')}`,
    async (evalTo) => {
      const state = await ant.getName({ evaluationOptions: { evalTo } });
      expect(state).toBeDefined();
    },
  );

  it.each(testCases)(
    `should get ticker with evaluation options: ${JSON.stringify('%s')}`,
    async (evalTo) => {
      const state = await ant.getTicker({ evaluationOptions: { evalTo } });
      expect(state).toBeDefined();
    },
  );

  it.each(testCases)(
    `should get balances with evaluation options: ${JSON.stringify('%s')}`,
    async (evalTo) => {
      const state = await ant.getBalances({ evaluationOptions: { evalTo } });
      expect(state).toBeDefined();
    },
  );

  it.each(testCases)(
    `should get balance with evaluation options: ${JSON.stringify('%s')}`,
    async (evalTo) => {
      const state = await ant.getBalance({
        address: 'TRVCopHzzO1VSwRUUS8umkiO2MpAL53XtVGlLaJuI94',
        evaluationOptions: { evalTo },
      });
      expect(state).toBeDefined();
    },
  );

  it('should get state with warp contract', async () => {
    const jwk = await arweave.wallets.generate();
    const signer = new ArweaveSigner(jwk);
    ANT.init({
      contract: new WarpContract<ANTState>({
        cacheUrl: localCacheUrl,
        contractTxId,
        logger: new DefaultLogger({ level: 'none' }),
      }),
      signer,
    });
    const state = await ant.getState();
    expect(state).toBeDefined();
  });
});
