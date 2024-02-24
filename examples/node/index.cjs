const { ArIO } = require('../../../lib/cjs/node/index.js');

(async () => {
  const arIO = new ArIO({});
  const testnetContract = arIO.testnet;
  const devnetContract = arIO.devnet;

  const testnetGateways = await testnetContract.getGateways();
  const devnetGateways = await devnetContract.getGateways();

  console.dir({ testnetGateways, devnetGateways }, { depth: 2 });
})();
