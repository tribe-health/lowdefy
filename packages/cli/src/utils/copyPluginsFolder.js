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

import path from 'path';
import fs from 'fs';
import { cleanDirectory, copyDirectory } from '@lowdefy/node-utils';

async function copyPluginsFolder({ context, directory }) {
  if (context.directories.config === directory) return;
  if (!fs.existsSync(path.join(context.directories.config, 'plugins'))) return;

  await cleanDirectory(path.join(directory, 'plugins'));
  await copyDirectory(
    path.join(context.directories.config, 'plugins'),
    path.join(directory, 'plugins'),
    {
      filter: (path) => !path.includes('node_modules'),
    }
  );
}

export default copyPluginsFolder;
