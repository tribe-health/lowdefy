/*
  Copyright 2020-2022 Lowdefy, Inc

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

import createCallbackPlugins from './createCallbackPlugins.js';

function createSessionCallback({ authConfig, plugins }) {
  const sessionCallbackPlugins = createCallbackPlugins({
    authConfig,
    plugins,
    type: 'session',
  });

  async function sessionCallback({ session, token, user }) {
    if (token) {
      session.user.sub = token.sub;
    }

    for (const plugin of sessionCallbackPlugins) {
      session = await plugin.fn({
        properties: plugin.properties ?? {},
        session,
        token,
        user,
      });
    }

    return session;
  }
  return sessionCallback;
}

export default createSessionCallback;
