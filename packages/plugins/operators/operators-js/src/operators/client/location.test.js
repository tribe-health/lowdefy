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

import location from './location.js';

jest.mock('@lowdefy/operators', () => ({
  getFromObject: jest.fn(),
}));

const input = {
  arrayIndices: [0],
  basePath: 'base',
  home: {
    pageId: 'home-page-id',
  },
  location: 'location',
  pageId: 'page-id',
  params: 'origin',
  window: {
    location: {
      hash: 'window.location.hash',
      host: 'window.location.host',
      hostname: 'window.location.hostname',
      href: 'window.location.href',
      origin: 'window.location.origin',
      pathname: 'window.location.pathname',
      port: 'window.location.port',
      protocol: 'window.location.protocol',
      search: 'window.location.search',
    },
  },
  lowdefyGlobal: { lowdefyGlobal: true },
};

test('location calls getFromObject', async () => {
  const lowdefyOperators = await import('@lowdefy/operators');
  location(input);
  expect(lowdefyOperators.getFromObject.mock.calls).toEqual([
    [
      {
        arrayIndices: [0],
        location: 'location',
        object: {
          basePath: 'base',
          homePageId: 'home-page-id',
          pageId: 'page-id',
          hash: 'window.location.hash',
          host: 'window.location.host',
          hostname: 'window.location.hostname',
          href: 'window.location.href',
          origin: 'window.location.origin',
          pathname: 'window.location.pathname',
          port: 'window.location.port',
          protocol: 'window.location.protocol',
          search: 'window.location.search',
        },
        operator: '_location',
        params: 'origin',
      },
    ],
  ]);
});

test('_location throw on no location', () => {
  Object.defineProperty(window, 'location', {
    writable: true,
    configurable: true,
    value: undefined,
  });
  expect(() => location({ params: 'origin', location: 'locationId' })).toThrow(
    'Operator Error: Browser window.location not available for _location. Received: "origin" at locationId.'
  );
});

test('_location throw invalid param', () => {
  expect(() => location({ ...input, params: 'none' })).toThrow(
    'Operator Error: _location only returns values for basePath, hash, homePageId, host, hostname, href, origin, pageId, pathname, port, protocol, search. Received: "none" at location.'
  );
});
