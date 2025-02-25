/* eslint-disable prefer-promise-reject-errors */

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

import testContext from './testContext.js';

const pageId = 'one';

const mockReqResponses = {
  request1: {
    data: {
      request: {
        id: 'request1',
        success: true,
        response: 1,
      },
    },
  },
};

const mockQueryImp = ({ variables }) => {
  const { input } = variables;
  const { requestId } = input;
  return new Promise((resolve, reject) => {
    if (requestId === 'req_error') {
      reject({ errorMessage: 'Error!' });
    }
    resolve(mockReqResponses[requestId]);
  });
};
const mockQuery = jest.fn();

const client = {
  query: mockQuery,
};

const RealDate = Date;
const mockDate = jest.fn(() => ({ date: 0 }));
mockDate.now = jest.fn(() => 0);

const lowdefy = {
  client,
  pageId,
};

const timeout = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Comment out to use console
console.log = () => {};
console.error = () => {};

beforeEach(() => {
  global.Date = mockDate;
});

afterAll(() => {
  global.Date = RealDate;
});

beforeEach(() => {
  mockQuery.mockReset();
  mockQuery.mockImplementation(mockQueryImp);
});

test('init Events', async () => {
  const rootBlock = {
    blockId: 'root',
    meta: {
      category: 'container',
    },
    areas: {
      content: {
        blocks: [
          {
            blockId: 'button',
            type: 'Button',
            meta: {
              category: 'display',
              valueType: 'string',
            },
            events: {
              onClick: [{ id: 'a', type: 'SetState', params: { a: 'a' } }],
            },
          },
        ],
      },
    },
  };
  const context = testContext({
    lowdefy,
    rootBlock,
  });
  const { button } = context.RootBlocks.map;
  expect(button.Events.events).toEqual({
    onClick: {
      actions: [{ id: 'a', type: 'SetState', params: { a: 'a' } }],
      catchActions: [],
      debounce: null,
      history: [],
      loading: false,
    },
  });
});

test('triggerEvent no event defined', async () => {
  const rootBlock = {
    blockId: 'root',
    meta: {
      category: 'container',
    },
    areas: {
      content: {
        blocks: [
          {
            blockId: 'button',
            type: 'Button',
            meta: {
              category: 'display',
              valueType: 'string',
            },
          },
        ],
      },
    },
  };
  const context = testContext({
    lowdefy,
    rootBlock,
  });
  const { button } = context.RootBlocks.map;
  const promise = button.triggerEvent({ name: 'onClick' });
  expect(button.Events.events).toEqual({});
  const res = await promise;
  expect(res).toEqual({
    blockId: 'button',
    bounced: false,
    endTimestamp: { date: 0 },
    event: undefined,
    eventName: 'onClick',
    responses: {},
    startTimestamp: { date: 0 },
    success: true,
  });
});

test('triggerEvent x1', async () => {
  const rootBlock = {
    blockId: 'root',
    meta: {
      category: 'container',
    },
    areas: {
      content: {
        blocks: [
          {
            blockId: 'button',
            type: 'Button',
            meta: {
              category: 'display',
              valueType: 'string',
            },
            events: {
              onClick: [{ id: 'a', type: 'SetState', params: { a: 'a' } }],
            },
          },
        ],
      },
    },
  };
  const context = testContext({
    lowdefy,
    rootBlock,
  });
  const { button } = context.RootBlocks.map;
  const promise = button.triggerEvent({ name: 'onClick', event: { x: 1 } });
  expect(button.Events.events).toEqual({
    onClick: {
      actions: [{ id: 'a', type: 'SetState', params: { a: 'a' } }],
      catchActions: [],
      debounce: null,
      history: [],
      loading: true,
    },
  });
  await promise;
  expect(button.Events.events.onClick.history[0]).toEqual({
    blockId: 'button',
    bounced: false,
    event: {
      x: 1,
    },
    eventName: 'onClick',
    responses: {
      a: {
        type: 'SetState',
        index: 0,
        response: undefined,
      },
    },
    success: true,
    startTimestamp: { date: 0 },
    endTimestamp: { date: 0 },
  });

  expect(button.Events.events.onClick.loading).toEqual(false);
});

test('triggerEvent, 2 actions', async () => {
  const rootBlock = {
    blockId: 'root',
    meta: {
      category: 'container',
    },
    requests: [{ requestId: 'request1' }],
    areas: {
      content: {
        blocks: [
          {
            blockId: 'button',
            type: 'Button',
            meta: {
              category: 'display',
              valueType: 'string',
            },
            events: {
              onClick: [
                { id: 'a', type: 'SetState', params: { a: 'a' } },
                { id: 'b', type: 'Request', params: 'request1' },
              ],
            },
          },
        ],
      },
    },
  };
  const context = testContext({
    lowdefy,
    rootBlock,
  });
  const { button } = context.RootBlocks.map;
  await button.triggerEvent({ name: 'onClick', event: { x: 1 } });
  expect(button.Events.events.onClick.history[0].event).toEqual({ x: 1 });
  expect(Object.keys(button.Events.events.onClick.history[0].responses).length).toEqual(2);
  expect(button.Events.events.onClick.loading).toEqual(false);
});

test('triggerEvent error', async () => {
  const rootBlock = {
    blockId: 'root',
    meta: {
      category: 'container',
    },
    areas: {
      content: {
        blocks: [
          {
            blockId: 'button',
            type: 'Button',
            meta: {
              category: 'display',
              valueType: 'string',
            },
            events: {
              onClick: [
                {
                  id: 'e',
                  type: 'Error',
                  params: { a: 'a' },
                },
              ],
            },
          },
        ],
      },
    },
  };
  const context = testContext({
    lowdefy,
    rootBlock,
  });
  const { button } = context.RootBlocks.map;
  await button.triggerEvent({ name: 'onClick', event: { x: 1 } });
  expect(button.Events.events.onClick.history[0]).toEqual({
    blockId: 'button',
    bounced: false,
    event: {
      x: 1,
    },
    eventName: 'onClick',
    error: {
      action: {
        id: 'e',
        params: {
          a: 'a',
        },
        type: 'Error',
      },
      error: {
        error: new Error('Invalid action type "Error" at "button".'),
        index: 0,
        type: 'Error',
      },
    },
    responses: {
      e: {
        type: 'Error',
        index: 0,
        error: new Error('Invalid action type "Error" at "button".'),
      },
    },
    success: false,
    startTimestamp: { date: 0 },
    endTimestamp: { date: 0 },
  });
});

test('registerEvent then triggerEvent x1', async () => {
  const rootBlock = {
    blockId: 'root',
    meta: {
      category: 'container',
    },
    areas: {
      content: {
        blocks: [
          {
            blockId: 'button',
            type: 'Button',
            meta: {
              category: 'display',
              valueType: 'string',
            },
          },
        ],
      },
    },
  };
  const context = testContext({
    lowdefy,
    rootBlock,
  });
  const { button } = context.RootBlocks.map;
  button.Events.registerEvent({
    name: 'onClick',
    actions: [{ id: 'a', type: 'SetState', params: { a: 'a' } }],
  });
  expect(button.Events.events).toEqual({
    onClick: {
      actions: [{ id: 'a', type: 'SetState', params: { a: 'a' } }],
      catchActions: [],
      debounce: null,
      history: [],
      loading: false,
    },
  });
  await button.triggerEvent({ name: 'onClick', event: { x: 1 } });
  expect(button.Events.events.onClick.history[0]).toEqual({
    blockId: 'button',
    bounced: false,
    event: {
      x: 1,
    },
    eventName: 'onClick',
    responses: {
      a: {
        type: 'SetState',
        index: 0,
        response: undefined,
      },
    },
    success: true,
    startTimestamp: { date: 0 },
    endTimestamp: { date: 0 },
  });
});

test('triggerEvent skip', async () => {
  const rootBlock = {
    blockId: 'root',
    meta: {
      category: 'container',
    },
    areas: {
      content: {
        blocks: [
          {
            blockId: 'button',
            type: 'Button',
            meta: {
              category: 'display',
              valueType: 'string',
            },
            events: {
              onClick: [{ id: 'a', type: 'SetState', params: { a: 'a' }, skip: true }],
            },
          },
        ],
      },
    },
  };
  const context = testContext({
    lowdefy,
    rootBlock,
    initState: { textInput: 'init' },
  });
  const { button } = context.RootBlocks.map;
  await button.triggerEvent({ name: 'onClick', event: { x: 1 } });
  expect(button.Events.events).toMatchInlineSnapshot(`
    Object {
      "onClick": Object {
        "actions": Array [
          Object {
            "id": "a",
            "params": Object {
              "a": "a",
            },
            "skip": true,
            "type": "SetState",
          },
        ],
        "catchActions": Array [],
        "debounce": null,
        "history": Array [
          Object {
            "blockId": "button",
            "bounced": false,
            "endTimestamp": Object {
              "date": 0,
            },
            "event": Object {
              "x": 1,
            },
            "eventName": "onClick",
            "responses": Object {
              "a": Object {
                "index": 0,
                "skipped": true,
                "type": "SetState",
              },
            },
            "startTimestamp": Object {
              "date": 0,
            },
            "success": true,
          },
        ],
        "loading": false,
      },
    }
  `);
  expect(context.eventLog).toMatchInlineSnapshot(`
    Array [
      Object {
        "blockId": "button",
        "bounced": false,
        "endTimestamp": Object {
          "date": 0,
        },
        "event": Object {
          "x": 1,
        },
        "eventName": "onClick",
        "responses": Object {
          "a": Object {
            "index": 0,
            "skipped": true,
            "type": "SetState",
          },
        },
        "startTimestamp": Object {
          "date": 0,
        },
        "success": true,
      },
    ]
  `);
});

test('triggerEvent skip tests === true', async () => {
  const rootBlock = {
    blockId: 'root',
    meta: {
      category: 'container',
    },
    areas: {
      content: {
        blocks: [
          {
            blockId: 'button',
            type: 'Button',
            meta: {
              category: 'display',
              valueType: 'string',
            },
            events: {
              onClick: [{ id: 'a', type: 'SetState', params: { a: 'a' }, skip: 'Truthy' }],
            },
          },
        ],
      },
    },
  };
  const context = testContext({
    lowdefy,
    rootBlock,
    initState: { textInput: 'init' },
  });
  const { button } = context.RootBlocks.map;
  await button.triggerEvent({ name: 'onClick', event: { x: 1 } });
  expect(button.Events.events).toMatchInlineSnapshot(`
    Object {
      "onClick": Object {
        "actions": Array [
          Object {
            "id": "a",
            "params": Object {
              "a": "a",
            },
            "skip": "Truthy",
            "type": "SetState",
          },
        ],
        "catchActions": Array [],
        "debounce": null,
        "history": Array [
          Object {
            "blockId": "button",
            "bounced": false,
            "endTimestamp": Object {
              "date": 0,
            },
            "event": Object {
              "x": 1,
            },
            "eventName": "onClick",
            "responses": Object {
              "a": Object {
                "index": 0,
                "response": undefined,
                "type": "SetState",
              },
            },
            "startTimestamp": Object {
              "date": 0,
            },
            "success": true,
          },
        ],
        "loading": false,
      },
    }
  `);
  expect(context.eventLog).toMatchInlineSnapshot(`
    Array [
      Object {
        "blockId": "button",
        "bounced": false,
        "endTimestamp": Object {
          "date": 0,
        },
        "event": Object {
          "x": 1,
        },
        "eventName": "onClick",
        "responses": Object {
          "a": Object {
            "index": 0,
            "response": undefined,
            "type": "SetState",
          },
        },
        "startTimestamp": Object {
          "date": 0,
        },
        "success": true,
      },
    ]
  `);
});

test('Actions array defaults', () => {
  const rootBlock = {
    blockId: 'root',
    meta: {
      category: 'container',
    },
    areas: {
      content: {
        blocks: [
          {
            blockId: 'button',
            type: 'Button',
            meta: {
              category: 'display',
              valueType: 'string',
            },
            events: {
              onClick: null,
            },
          },
        ],
      },
    },
  };
  const context = testContext({
    lowdefy,
    rootBlock,
  });
  const { button } = context.RootBlocks.map;
  button.Events.registerEvent({
    name: 'registered',
    actions: null,
  });
  expect(button.Events.events).toEqual({
    onClick: { actions: [], history: [], loading: false, catchActions: [], debounce: null },
    registered: { actions: [], history: [], loading: false, catchActions: [], debounce: null },
  });
});

test('Actions try catch array defaults', () => {
  const rootBlock = {
    blockId: 'root',
    meta: {
      category: 'container',
    },
    areas: {
      content: {
        blocks: [
          {
            blockId: 'button',
            type: 'Button',
            meta: {
              category: 'display',
              valueType: 'string',
            },
            events: {
              onClick: {
                try: null,
                catch: null,
              },
            },
          },
        ],
      },
    },
  };
  const context = testContext({
    lowdefy,
    rootBlock,
  });
  const { button } = context.RootBlocks.map;
  expect(button.Events.events).toEqual({
    onClick: { actions: [], history: [], loading: false, catchActions: [], debounce: undefined },
  });
});

test('Actions try catch arrays', () => {
  const rootBlock = {
    blockId: 'root',
    meta: {
      category: 'container',
    },
    areas: {
      content: {
        blocks: [
          {
            blockId: 'button',
            type: 'Button',
            meta: {
              category: 'display',
              valueType: 'string',
            },
            events: {
              onClick: {
                try: [{ id: 'a', type: 'SetState', params: { a: 'a' } }],
                catch: [{ id: 'b', type: 'SetState', params: { b: 'b' } }],
              },
            },
          },
        ],
      },
    },
  };
  const context = testContext({
    lowdefy,
    rootBlock,
  });
  const { button } = context.RootBlocks.map;
  expect(button.Events.events).toEqual({
    onClick: {
      actions: [{ id: 'a', type: 'SetState', params: { a: 'a' } }],
      history: [],
      loading: false,
      catchActions: [{ id: 'b', type: 'SetState', params: { b: 'b' } }],
    },
  });
});

test('Actions try catch arrays and debounce.immediate == true (leading edge)', async () => {
  const rootBlock = {
    blockId: 'root',
    meta: {
      category: 'container',
    },
    areas: {
      content: {
        blocks: [
          {
            blockId: 'button',
            type: 'Button',
            meta: {
              category: 'display',
              valueType: 'string',
            },
            events: {
              onClick: {
                debounce: {
                  ms: 100,
                  immediate: true,
                },
                try: [{ id: 'a', type: 'SetState', params: { a: 'a' } }],
              },
            },
          },
        ],
      },
    },
  };
  const context = testContext({
    lowdefy,
    rootBlock,
  });
  const { button } = context.RootBlocks.map;
  expect(button.Events.events).toEqual({
    onClick: {
      actions: [{ id: 'a', type: 'SetState', params: { a: 'a' } }],
      history: [],
      loading: false,
      catchActions: [],
      debounce: {
        immediate: true,
        ms: 100,
      },
    },
  });
  const firstClick = button.triggerEvent({ name: 'onClick', event: { x: 1 } });
  await timeout(10);
  expect(context.eventLog.length).toEqual(1);
  const secondClick = button.triggerEvent({ name: 'onClick', event: { x: 1 } });
  expect(context.eventLog.length).toEqual(2);
  const secondClickResponse = await secondClick;
  expect(secondClickResponse.bounced).toEqual(true);
  const firstClickResponse = await firstClick;
  expect(firstClickResponse.bounced).toEqual(false);
  await timeout(100);
  const thirdClick = await button.triggerEvent({ name: 'onClick', event: { x: 1 } });
  expect(thirdClick.bounced).toEqual(false);
  expect(context.eventLog).toEqual([
    {
      blockId: 'button',
      bounced: false,
      endTimestamp: {
        date: 0,
      },
      event: {
        x: 1,
      },
      eventName: 'onClick',
      responses: {
        a: {
          index: 0,
          response: undefined,
          type: 'SetState',
        },
      },
      startTimestamp: {
        date: 0,
      },
      success: true,
    },
    {
      blockId: 'button',
      bounced: true,
      endTimestamp: {
        date: 0,
      },
      event: {
        x: 1,
      },
      eventName: 'onClick',
      responses: {},
      startTimestamp: {
        date: 0,
      },
      success: true,
    },
    {
      blockId: 'button',
      bounced: false,
      endTimestamp: {
        date: 0,
      },
      event: {
        x: 1,
      },
      eventName: 'onClick',
      responses: {
        a: {
          index: 0,
          response: undefined,
          type: 'SetState',
        },
      },
      startTimestamp: {
        date: 0,
      },
      success: true,
    },
  ]);
});

test('Actions try catch arrays and debounce.immediate == undefined (trailing edge)', async () => {
  const rootBlock = {
    blockId: 'root',
    meta: {
      category: 'container',
    },
    areas: {
      content: {
        blocks: [
          {
            blockId: 'button',
            type: 'Button',
            meta: {
              category: 'display',
              valueType: 'string',
            },
            events: {
              onClick: {
                debounce: {
                  ms: 100,
                },
                try: [{ id: 'a', type: 'SetState', params: { a: 'a' } }],
              },
            },
          },
        ],
      },
    },
  };
  const context = testContext({
    lowdefy,
    rootBlock,
  });
  const { button } = context.RootBlocks.map;
  expect(button.Events.events).toEqual({
    onClick: {
      actions: [{ id: 'a', type: 'SetState', params: { a: 'a' } }],
      history: [],
      loading: false,
      catchActions: [],
      debounce: {
        ms: 100,
      },
    },
  });
  const firstClick = button.triggerEvent({ name: 'onClick', event: { x: 1 } });
  await timeout(10);
  const secondClick = button.triggerEvent({ name: 'onClick', event: { x: 1 } });
  const firstClickResponse = await firstClick;
  expect(firstClickResponse.bounced).toEqual(true);
  const secondClickResponse = await secondClick;
  expect(secondClickResponse.bounced).toEqual(false);
  const thirdClick = await button.triggerEvent({ name: 'onClick', event: { x: 1 } });
  expect(thirdClick.bounced).toEqual(false);
  expect(context.eventLog).toEqual([
    {
      blockId: 'button',
      bounced: false,
      endTimestamp: {
        date: 0,
      },
      event: {
        x: 1,
      },
      eventName: 'onClick',
      responses: {
        a: {
          index: 0,
          response: undefined,
          type: 'SetState',
        },
      },
      startTimestamp: {
        date: 0,
      },
      success: true,
    },
    {
      blockId: 'button',
      bounced: false,
      endTimestamp: {
        date: 0,
      },
      event: {
        x: 1,
      },
      eventName: 'onClick',
      responses: {
        a: {
          index: 0,
          response: undefined,
          type: 'SetState',
        },
      },
      startTimestamp: {
        date: 0,
      },
      success: true,
    },
    {
      blockId: 'button',
      bounced: true,
      endTimestamp: {
        date: 0,
      },
      event: {
        x: 1,
      },
      eventName: 'onClick',
      responses: {},
      startTimestamp: {
        date: 0,
      },
      success: true,
    },
  ]);
});

test('Actions try catch arrays and debounce.immediate == false default ms (trailing edge)', async () => {
  const rootBlock = {
    blockId: 'root',
    meta: {
      category: 'container',
    },
    areas: {
      content: {
        blocks: [
          {
            blockId: 'button',
            type: 'Button',
            meta: {
              category: 'display',
              valueType: 'string',
            },
            events: {
              onClick: {
                debounce: {
                  immediate: false,
                },
                try: [{ id: 'a', type: 'SetState', params: { a: 'a' } }],
              },
            },
          },
        ],
      },
    },
  };
  const context = testContext({
    lowdefy,
    rootBlock,
  });
  const { button } = context.RootBlocks.map;
  expect(button.Events.events).toEqual({
    onClick: {
      actions: [{ id: 'a', type: 'SetState', params: { a: 'a' } }],
      history: [],
      loading: false,
      catchActions: [],
      debounce: {
        immediate: false,
      },
    },
  });
  const firstClick = button.triggerEvent({ name: 'onClick', event: { x: 1 } });
  await timeout(10);
  expect(context.eventLog.length).toEqual(0);
  const secondClick = button.triggerEvent({ name: 'onClick', event: { x: 1 } });
  expect(context.eventLog.length).toEqual(1);
  await timeout(250);
  expect(context.eventLog.length).toEqual(1);
  await timeout(60);
  expect(context.eventLog.length).toEqual(2);
  const firstClickResponse = await firstClick;
  expect(firstClickResponse.bounced).toEqual(true);
  const secondClickResponse = await secondClick;
  expect(secondClickResponse.bounced).toEqual(false);
  expect(context.eventLog).toEqual([
    {
      blockId: 'button',
      bounced: false,
      endTimestamp: {
        date: 0,
      },
      event: {
        x: 1,
      },
      eventName: 'onClick',
      responses: {
        a: {
          index: 0,
          response: undefined,
          type: 'SetState',
        },
      },
      startTimestamp: {
        date: 0,
      },
      success: true,
    },
    {
      blockId: 'button',
      bounced: true,
      endTimestamp: {
        date: 0,
      },
      event: {
        x: 1,
      },
      eventName: 'onClick',
      responses: {},
      startTimestamp: {
        date: 0,
      },
      success: true,
    },
  ]);
});
