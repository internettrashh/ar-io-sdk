import {
  ANTRegistry,
  ANT_REGISTRY_ID,
  AOProcess,
  ARIO,
  arioDevnetProcessId,
} from '@ar.io/sdk/web';
import { connect } from '@permaweb/aoconnect';
import { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import './App.css';

const ario = ARIO.init({
  process: new AOProcess({
    processId: process.env.ARIO_PROCESS_ID || arioDevnetProcessId,
    ao: connect({
      CU_URL: 'http://localhost:6363',
    }),
  }),
});
const antRegistry = ANTRegistry.init();
function App() {
  const [contract, setContract] = useState<string>('Loading...');
  const [ants, setAnts] = useState<string>('Loading...');
  const [arioContractSuccess, setArioContractSuccess] =
    useState<boolean>(false);
  const [antRegistrySuccess, setAntRegistrySuccess] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [registryLoaded, setRegistryLoaded] = useState<boolean>(false);

  useEffect(() => {
    Promise.all([
      ario
        .getInfo()
        .then((state: any) => {
          setContract(`\`\`\`json\n${JSON.stringify(state, null, 2)}`);
          setArioContractSuccess(true);
        })
        .catch((error: any) => {
          console.error(error);
          setArioContractSuccess(false);
          setContract('Error loading contract state');
        })
        .finally(() => {
          setLoaded(true);
        }),
      antRegistry
        .accessControlList({
          address: ANT_REGISTRY_ID,
        })
        .then((affiliatedAnts: { Owned: string[]; Controlled: string[] }) => {
          setAnts(`\`\`\`json\n${JSON.stringify(affiliatedAnts, null, 2)}`);
          setAntRegistrySuccess(true);
        })
        .catch((error: any) => {
          console.error(error);
          setAntRegistrySuccess(false);
          setAnts('Error loading affiliated ants');
        })
        .finally(() => {
          setRegistryLoaded(true);
        }),
    ]);
  }, []);

  return (
    <div className="App">
      <div>
        {loaded && (
          <div data-testid="load-info-result">{`${arioContractSuccess}`}</div>
        )}
        <Markdown className="markdown" remarkPlugins={[remarkGfm]}>
          {contract}
        </Markdown>
      </div>
      {registryLoaded && (
        <div data-testid="load-registry-result">{`${antRegistrySuccess}`}</div>
      )}
      <Markdown className="markdown" remarkPlugins={[remarkGfm]}>
        {ants}
      </Markdown>
    </div>
  );
}

export default App;
