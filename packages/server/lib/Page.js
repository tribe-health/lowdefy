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

import { useRouter } from 'next/router';
import Client from '@lowdefy/client';
import Head from 'next/head';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';

import actions from '../build/plugins/actions.js';
import blocks from '../build/plugins/blocks.js';
import icons from '../build/plugins/icons.js';
import operators from '../build/plugins/operators/client.js';

const Page = ({ pageConfig, rootConfig }) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  // If session is passed to SessionProvider from getServerSideProps
  // we won't have a loading state here.
  // But 404 uses getStaticProps so we have this for 404.
  if (status === 'loading') {
    return '';
  }

  return (
    <Client
      auth={{ signIn, signOut }}
      Components={{ Head, Link }}
      config={{
        pageConfig,
        rootConfig,
      }}
      router={router}
      session={session}
      types={{
        actions,
        blocks,
        icons,
        operators,
      }}
      window={window}
    />
  );
};

export default Page;
