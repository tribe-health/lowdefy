import lt from '../../src/common/lt';

const location = 'locationId';

test('_lt param 0 less than param 1', () => {
  expect(lt({ params: [0, 1], location })).toBe(true);
  expect(lt({ params: [-1, 0], location })).toBe(true);
  expect(lt({ params: [-1, 1], location })).toBe(true);
  expect(lt({ params: [0.1, 0.2], location })).toBe(true);
  expect(lt({ params: [null, 1], location })).toBe(true);
  expect(lt({ params: [new Date(1), new Date(2)], location })).toBe(true);
  expect(lt({ params: [null, new Date(2)], location })).toBe(true);
  expect(lt({ params: [false, true], location })).toBe(true);
  expect(lt({ params: ['a', 'b'], location })).toBe(true);
  expect(lt({ params: ['aa', 'b'], location })).toBe(true);
  expect(lt({ params: ['b', 'bb'], location })).toBe(true);
});

test('_lt param 0 greater than param 1', () => {
  expect(lt({ params: [1, 1], location })).toBe(false);
  expect(lt({ params: [1, 0], location })).toBe(false);
  expect(lt({ params: [0, -1], location })).toBe(false);
  expect(lt({ params: [1, -1], location })).toBe(false);
  expect(lt({ params: [0.2, 0.1], location })).toBe(false);
  expect(lt({ params: [1, null], location })).toBe(false);
  expect(lt({ params: [null, null], location })).toBe(false);
  expect(lt({ params: [new Date(2), new Date(1)], location })).toBe(false);
  expect(lt({ params: [new Date(2), null], location })).toBe(false);
  expect(lt({ params: ['bbb', 'bb'], location })).toBe(false);
  expect(lt({ params: ['b', 'b'], location })).toBe(false);
  expect(lt({ params: [new Date(1), new Date(1)], location })).toBe(false);
});

test('_lt params not an array', () => {
  expect(() => lt({ params: '1, 0', location })).toThrow(
    'Operator Error: _lt takes an array type as input. Received: "1, 0" at locationId.'
  );
});

test('_lt params array with length 1', () => {
  expect(() => lt({ params: [1], location })).toThrow(
    'Operator Error: _lt takes an array of length 2 as input. Received: [1] at locationId.'
  );
});

test('_lt params array with length 3', () => {
  expect(() => lt({ params: [1, 2, 3], location })).toThrow(
    'Operator Error: _lt takes an array of length 2 as input. Received: [1,2,3] at locationId.'
  );
});