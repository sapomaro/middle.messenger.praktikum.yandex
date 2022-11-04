import type {PlainObject, JSONable} from '../constants/types';

export async function sleep(ms = 100) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isPlainObject(value: unknown): value is PlainObject {
  return (typeof value === 'object' &&
    value !== null &&
    value.constructor === Object);
}

export function isEmptyObject(obj: JSONable): boolean {
  return (Object.keys(obj).length === 0);
}

export function isKeyOfObject(key: unknown,
    obj: unknown): key is keyof typeof obj {
  if (typeof obj !== 'object' || obj === null) return false;
  if (typeof key !== 'string' && typeof key !== 'number') return false;
  if (key in obj && typeof obj[key as keyof typeof obj] !== 'undefined') {
    return true;
  }
  return false;
}

export function isArray(value: unknown): value is [] {
  return Array.isArray(value);
}

export function isArrayOrObject(value: unknown): value is [] | PlainObject {
  return (isPlainObject(value) || isArray(value));
}

export function arraysAreEqual(baseArr: unknown[], secondArr: unknown[]) {
  if (baseArr === secondArr) return true;
  if (baseArr.length !== secondArr.length) return false;
  for (let i = baseArr.length; i >= 0; --i) {
    if (baseArr[i] !== secondArr[i]) return false;
  }
  return true;
}

export function cloneDeep<T>(entity: T,
    callback = <TT>(value: TT): TT => value) {
  return (function cloneDeepRecursive(item: T): T {
    if (item === null || typeof item !== 'object') {
      return callback(item);
    }
    if (item instanceof Array) {
      const copy = [];
      for (const value of item) {
        copy.push(cloneDeepRecursive(value));
      }
      return copy as T;
    }
    if (item instanceof Object) {
      const copy: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(item)) {
        copy[key] = cloneDeepRecursive(value);
      }
      return copy as T;
    }
    throw new Error(`Unable to copy object: ${item}`);
  })(entity);
}

export function objIntersect<T1, T2>(
    base: T1, chunk: T2,
): boolean {
  return (function compareDeepRecursive(base: T1, chunk: T2): boolean {
    if (base === chunk as unknown as T1) {
      return true;
    }
    if (base instanceof Array) {
      if (!(chunk instanceof Array)) return false;
      if (chunk.length === 0) return false;
      for (let i = chunk.length - 1; i >= 0; --i) {
        if (!compareDeepRecursive(base[i], chunk[i])) return false;
      }
      return true;
    }
    if (base instanceof Object) {
      if (!(chunk instanceof Object)) return false;
      if (isEmptyObject(chunk as PlainObject)) return false;
      for (const [key, value] of Object.entries(chunk)) {
        if (!isKeyOfObject(key, base)) return false;
        if (!compareDeepRecursive(base[key], value)) {
          return false;
        }
      }
      return true;
    }
    return false;
  })(base, chunk);
}

export function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const JSONWrapper = {
  parse: (data: string): JSONable => {
    try {
      return JSON.parse(data.replace(/^\"|\"$/g, ''));
    } catch (error) {
      console.warn('JSON.parse failed', data, error);
      return {};
    }
  },
  stringify: (data: JSONable): string => {
    try {
      return JSON.stringify(data);
    } catch (error) {
      console.warn('JSON.stringify failed', data, error);
      return '{}';
    }
  },
};
