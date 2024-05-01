import { WarpFactory } from 'warp-contracts';
import { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import './App.css';

const contractTxId = 'ilwT4ObFQ7cGPbW-8z-h7mvvWGt_yhWNlqxNjSUgiYY';
const warp = WarpFactory.forMainnet();
const antContract = warp.contract(contractTxId);

function App() {
  const [contract, setContract] = useState<string>('Loading...');

  // NOTE: there is a bug in warp-contracts causing this to fail on `AbortError` import missing
  useEffect(() => {
    antContract.syncState(`https://api.arns.app/v1/contract/${contractTxId}`, {
        validity: true
      }).then(async (syncContract) => {
        const { cachedValue } = await syncContract.readState();
        setContract(`\`\`\`json\n${JSON.stringify(cachedValue.state, null, 2)}`);
      })
      .catch((error) => {
        console.error(error);
        setContract('Error loading contract state');
      });
  }, []);

  return (
    <div className="App">
      <Markdown className="markdown" remarkPlugins={[remarkGfm]}>
        {contract}
      </Markdown>
    </div>
  );
}

export default App;
