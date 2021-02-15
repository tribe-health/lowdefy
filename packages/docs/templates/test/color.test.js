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

import propertiesFormTransformer from '../blocks/propertiesFormTransformer';
import propertiesGetterTransformer from '../blocks/propertiesGetterTransformer';
import defaultValueTransformer from '../blocks/defaultValueTransformer';

const schema = {
  schema: {
    properties: {
      type: 'object',
      additionalProperties: false,
      properties: {
        field: {
          type: 'string',
          description: 'description',
          docs: {
            displayType: 'color',
          },
        },
      },
    },
  },
};

test('color propertiesFormTransformer', () => {
  expect(propertiesFormTransformer(schema)).toMatchInlineSnapshot(`
    Array [
      Object {
        "id": "block.properties.field",
        "layout": Object {
          "_global": "settings_input_layout",
        },
        "properties": Object {
          "circleSize": 14,
          "circleSpacing": 8,
          "colors": Array [
            "#f5222d",
            "#fa541c",
            "#fa8c16",
            "#faad14",
            "#fadb14",
            "#a0d911",
            "#52c41a",
            "#13c2c2",
            "#1890ff",
            "#2f54eb",
            "#722ed1",
            "#eb2f96",
            "#595959",
            "#bfbfbf",
            "#d9d9d9",
          ],
          "label": Object {
            "align": "right",
            "extra": "description",
            "span": 8,
          },
          "showValue": true,
          "size": "small",
          "title": "field",
        },
        "required": false,
        "type": "CircleColorSelector",
      },
    ]
  `);
});

test('color propertiesGetterTransformer', () => {
  expect(propertiesGetterTransformer(schema, { block_type: 'Block' })).toMatchInlineSnapshot(`
    Object {
      "_object.assign": Array [
        Object {
          "_state": Object {
            "contextId": "Block:Block:{}",
            "default": Object {},
            "key": "block.properties",
          },
        },
      ],
    }
  `);
});

test('color defaultValueTransformer', () => {
  expect(defaultValueTransformer(schema)).toMatchInlineSnapshot(`
    Object {
      "field": null,
    }
  `);
  const schemaDV = {
    schema: {
      properties: {
        type: 'object',
        additionalProperties: false,
        properties: {
          field: {
            type: 'string',
            default: 'value',
            description: 'description',
            docs: {
              displayType: 'color',
            },
          },
        },
      },
    },
  };
  expect(defaultValueTransformer(schemaDV)).toMatchInlineSnapshot(`
    Object {
      "field": "value",
    }
  `);
});
