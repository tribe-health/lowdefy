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

import axios from 'axios';

async function checkForUpdatedVersions({ cliVersion, lowdefyVersion, print }) {
  if (isExperimentalVersion(cliVersion) || isExperimentalVersion(lowdefyVersion)) {
    print.warn(`
---------------------------------------------------
  You are using an experimental version of Lowdefy.
  Features may change at any time.
---------------------------------------------------`);
    return;
  }
  const registryUrl = 'https://registry.npmjs.org/lowdefy';
  try {
    const packageInfo = await axios.get(registryUrl);
    const latestVersion = packageInfo.data['dist-tags'].latest;

    if (cliVersion !== latestVersion) {
      print.warn(`
-------------------------------------------------------------
  You are not using the latest version of the Lowdefy CLI.
  Please update to version ${latestVersion}.
  To always use the latest version, run 'npx lowdefy@latest'.
-------------------------------------------------------------`);
    }
    if (lowdefyVersion && lowdefyVersion !== latestVersion) {
      print.warn(`
-------------------------------------------------------------
  Your app is not using the latest Lowdefy version, ${lowdefyVersion}.
  Please update your app to version ${latestVersion}.
  View the changelog here:
    https://github.com/lowdefy/lowdefy/blob/main/CHANGELOG.md
-------------------------------------------------------------`);
    }
  } catch (error) {
    print.warn('Failed to check for latest Lowdefy version.');
  }
}

function isExperimentalVersion(version) {
  return version.includes('alpha') || version.includes('beta') || version.includes('rc');
}

export default checkForUpdatedVersions;
