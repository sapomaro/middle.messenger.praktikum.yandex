import {isPlainObject, isKeyOfObject, isEmptyObject,
  isArray, isArrayOrObject, arraysAreEqual,
  cloneDeep, objIntersect, rand, JSONWrapper} from '../Utils';

import type {JSONable} from '../../constants/types';

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
  test('JSONWrapper.parse works properly', () => {
    expect(JSONWrapper.parse('{"key": 1}')).toEqual({key: 1});
    expect(JSONWrapper.parse('[{"a": 1}, "2"]')).toEqual([{a: 1}, '2']);
  });

  test('JSONWrapper.parse should warn on bad JSON data', () => {
    global.console.warn = jest.fn();

    expect(JSONWrapper.parse('wrongentry')).toEqual({});
    expect(global.console.warn).toBeCalled();
  });

  test('JSONWrapper.stringify works properly', () => {
    expect(JSONWrapper.stringify({key: 1})).toBe('{"key":1}');
    expect(JSONWrapper.stringify([{a: 1}, '2'])).toBe('[{"a":1},"2"]');
    expect(JSONWrapper.stringify(/test/ as unknown as JSONable)).toEqual('{}');
  });

  test('rand works properly', () => {
    expect(rand(1, 2)).toBeGreaterThan(0);
    expect(rand(1, 2)).toBeLessThan(3);
    expect(rand(4, 5)).toBeGreaterThan(3);
    expect(rand(4, 5)).toBeLessThan(6);
    expect(rand(8, 9)).toBeGreaterThan(7);
    expect(rand(8, 9)).toBeLessThan(10);
  });

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
