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

// TODO: temp fix while waiting for blocks-antd
export default {
  id: '404',
  type: 'Box',
};

// export default {
//   id: '404',
//   type: 'Result',
//   style: {
//     minHeight: '100vh',
//   },
//   properties: {
//     status: 404,
//     title: '404',
//     subTitle: 'Sorry, the page you are visiting does not exist.',
//   },
//   areas: {
//     extra: {
//       blocks: [
//         {
//           id: 'home',
//           type: 'Button',
//           properties: {
//             title: 'Go to home page',
//             type: 'Link',
//             icon: 'HomeOutlined',
//           },
//           events: {
//             onClick: [
//               {
//                 id: 'home',
//                 type: 'Link',
//                 params: {
//                   home: true,
//                 },
//               },
//             ],
//           },
//         },
//       ],
//     },
//   },
// };