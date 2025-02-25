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

import React from 'react';
import { render } from '@testing-library/react';

import ErrorPage from './ErrorPage.js';

test('default', () => {
  const { container } = render(<ErrorPage />);
  expect(container.firstChild).toMatchSnapshot();
});

test('custom props', () => {
  const { container } = render(
    <ErrorPage
      code={301}
      description={'Error description'}
      message={'Error message'}
      name={'Error name'}
    />
  );
  expect(container.firstChild).toMatchSnapshot();
});
