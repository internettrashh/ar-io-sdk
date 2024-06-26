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
import EventEmitter from 'eventemitter3';
import { pLimit } from 'plimit-lit';

import { ANT } from '../../common/ant.js';
import { IO } from '../../common/io.js';
import { ioDevnetProcessId } from '../../constants.js';
import { AoIORead, ProcessId, WalletAddress } from '../../types.js';

// throttle the requests to avoid rate limiting
const throttle = pLimit(50);
export const getANTProcessesOwnedByWallet = async ({
  address,
  contract = IO.init({
    processId: ioDevnetProcessId,
  }),
}: {
  address: WalletAddress;
  contract?: AoIORead;
}): Promise<ProcessId[]> => {
  // get the record names of the registry - TODO: this may need to be paginated
  const uniqueContractProcessIds = await contract
    .getArNSRecords()
    .then((records) =>
      Object.values(records)
        .filter((record) => record.processId !== undefined)
        .map((record) => record.processId),
    );

  // check the contract owner and controllers
  const ownedOrControlledByWallet = await Promise.all(
    uniqueContractProcessIds.map(async (processId) =>
      throttle(async () => {
        const ant = ANT.init({
          processId,
        });
        const [owner, controllers = []] = await Promise.all([
          ant.getOwner().catch(() => undefined),
          ant.getControllers().catch(() => []),
        ]);
        if (owner === address || controllers.includes(address)) {
          return processId;
        }
        return;
      }),
    ),
  );

  if (ownedOrControlledByWallet.length === 0) {
    return [];
  }

  // TODO: insert gql query to find ANT processes owned by wallet given wallet not currently in the registry
  return [...new Set(ownedOrControlledByWallet)] as string[];
};

export class ArNSNameEmitter extends EventEmitter {
  protected contract: AoIORead;
  constructor() {
    super();
    this.contract = IO.init({
      processId: ioDevnetProcessId,
    });
  }

  async fetchProcessesOwnedByWallet({ address }: { address: WalletAddress }) {
    const uniqueContractProcessIds = await this.contract
      .getArNSRecords()
      .then((records) =>
        Object.values(records)
          .filter((record) => record.processId !== undefined)
          .map((record) => record.processId),
      );

    // check the contract owner and controllers
    await Promise.all(
      uniqueContractProcessIds.map(async (processId) =>
        throttle(async () => {
          const ant = ANT.init({
            processId,
          });
          const [owner, controllers = []] = await Promise.all([
            ant.getOwner().catch(() => {
              this.emit(
                'error',
                `Error getting owner for process ${processId}`,
              );
              return undefined;
            }),
            ant.getControllers().catch(() => {
              this.emit(
                'error',
                `Error getting controllers for process ${processId}`,
              );
              return [];
            }),
          ]);
          if (owner === address || controllers.includes(address)) {
            this.emit('process', processId);
          }
        }),
      ),
    );
  }
}
