import { ANTRegistry, AoANTRegistryRead } from '@ar.io/sdk/web';
import '@testing-library/jest-dom';
import { act, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import App from './App';

describe('ESM browser validation', () => {
  let registry: AoANTRegistryRead;
  const address = '7waR8v4STuwPnTck1zFVkQqJh5K9q9Zik4Y5-5dV7nk';

  beforeAll(async () => {
    registry = ANTRegistry.init();
  });
  it('should load the app and SDK', async () => {
    await act(async () => render(<App />));

    await waitFor(
      () => {
        console.log('waiting for contract info to render...');
        screen.getByTestId('load-info-result');
      },
      {
        interval: 2000,
        timeout: 30000,
      },
    );

    const result = screen.getByTestId('load-info-result');
    // check the sdk loaded the data
    expect(result).toHaveTextContent('true');
  });

  it('should retrieve ids from registry', async () => {
    const antIdsRes = await registry.accessControlList({ address });
    const antIds = [...antIdsRes.Owned, ...antIdsRes.Controlled];
    expect(antIds).toBeInstanceOf(Array);
  });
});
