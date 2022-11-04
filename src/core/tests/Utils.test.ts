import {isPlainObject, isKeyOfObject, isEmptyObject,
  isArray, isArrayOrObject, arraysAreEqual,
  cloneDeep, objIntersect} from '../Utils';

describe('core/Utils (advanced)', () => {
  test('cloneDeep works properly', () => {
    const mock = {keyA: 1, nested: {keyB: 2}};
    expect(cloneDeep(true)).toBe(true);
    expect(cloneDeep(mock)).not.toBe(mock);
    expect(cloneDeep(mock.nested)).not.toBe(mock.nested);
    expect(cloneDeep(mock)).toEqual({keyA: 1, nested: {keyB: 2}});
    expect(cloneDeep([1, 2, 3])).toEqual([1, 2, 3]);
  });

  test('cloneDeep with transformer callback works properly', () => {
    const mock = {keyA: 'a', nested: {keyB: 'b'}, keyC: 3};

    const clone = cloneDeep(mock, <T>(value: T): T => {
      if (typeof value === 'string') return `_${value}_` as T;
      return value;
    });

    expect(clone.keyA).toBe('_a_');
    expect(clone.nested.keyB).toBe('_b_');
    expect(clone.keyC).toBe(3);
  });

  test('objIntersect works properly', () => {
    const mock = {keyA: 'a', nested: {keyB: 'b'}, keyC: 3};

    expect(objIntersect(mock, mock)).toBe(true);
    expect(objIntersect(mock, {keyC: 3})).toBe(true);
    expect(objIntersect(mock, {keyC: '3'})).toBe(false);
    expect(objIntersect(mock, {nested: {keyB: 'b'}})).toBe(true);
    expect(objIntersect(mock, {nested: {keyB: 'c'}})).toBe(false);
    expect(objIntersect(mock, {})).toBe(false);
    expect(objIntersect({key: 1}, {key: 2})).toBe(false);
    expect(objIntersect({}, {})).toBe(false);
    expect(objIntersect({}, {key: 1})).toBe(false);
    expect(objIntersect([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(objIntersect([1, 2, 3], [1, 2])).toBe(true);
    expect(objIntersect([], [])).toBe(false);
    expect(objIntersect([1, 2, 3], [])).toBe(false);
    expect(objIntersect([1, 2, 3], [3, 2, 1])).toBe(false);
  });
});

describe('core/Utils (basic)', () => {
  test('isPlainObject works properly', () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject({test: 123})).toBe(true);
    expect(isPlainObject([])).toBe(false);
    expect(isPlainObject(document.createElement('div'))).toBe(false);
  });

  test('isEmptyObject works properly', () => {
    expect(isEmptyObject({key: 1})).toBe(false);
    expect(isEmptyObject({})).toBe(true);
    expect(isEmptyObject([])).toBe(true);
  });

  test('isKeyOfObject works properly', () => {
    expect(isKeyOfObject('key', {key: 1})).toBe(true);
    expect(isKeyOfObject(0, [1])).toBe(true);
    expect(isKeyOfObject('key', {wrongkey: 1})).toBe(false);
    expect(isKeyOfObject('key', 'not object')).toBe(false);
  });

  test('isArray works properly', () => {
    expect(isArray([])).toBe(true);
    expect(isArray({})).toBe(false);
    expect(isArray(null)).toBe(false);
    expect(isArray(123)).toBe(false);
  });

  test('isArrayOrObject works properly', () => {
    expect(isArrayOrObject({})).toBe(true);
    expect(isArrayOrObject([])).toBe(true);
    expect(isArrayOrObject(null)).toBe(false);
    expect(isArrayOrObject(123)).toBe(false);
  });

  test('arraysAreEqual works properly', () => {
    expect(arraysAreEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(arraysAreEqual([1, 2, 3], [1, 2])).toBe(false);
    expect(arraysAreEqual([1, 2, 3], [])).toBe(false);
  });
});
