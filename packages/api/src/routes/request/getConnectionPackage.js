/*
  Copyright 2020-2021 Lowdefy, Inc

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
import { createRequire } from 'module';
import { ConfigurationError } from '../../context/errors';

async function getConnectionPackage({ connectionTypes, logger }, { connection, request }) {
  const connectionTypeDefinition = connectionTypes[connection.type];
  if (!connectionTypeDefinition) {
    throw new ConfigurationError(
      `Request "${request.requestId}" has undefined connection type "${connection.type}".`
    );
  }

  const require = createRequire(import.meta.url);
  const connectionPackage = require(connectionTypeDefinition.package);

  logger.info(connectionPackage);

  if (!connectionPackage) {
    throw new ConfigurationError(
      `Connection package "${connectionTypeDefinition.package}" could not be imported.`
    );
  }
  return connectionPackage;
}

export default getConnectionPackage;
