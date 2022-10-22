type AnyArr = Array<unknown>;
type AnyObj = AnyArr | Record<string, unknown> | {};

export type PlainObject<T = unknown> = {
  [k in string]: T;
};

export const isPlainObject = (value: unknown): value is PlainObject => {
  return (typeof value === 'object' &&
    value !== null &&
    value.constructor === Object);
    // && Object.prototype.toString.call(value) === '[object Object])';
}

export const isArray = (value: unknown): value is [] => {
  return Array.isArray(value);
}

export const isArrayOrObject = (value: unknown): value is [] | PlainObject => {
  return (isPlainObject(value) || isArray(value));
}

export const JSONWrapper = {
  parse: (data: string): AnyObj => {
    try {
      return JSON.parse(data.replace(/^\"|\"$/g, ''));
    } catch (error) {
      console.warn(data);
      console.warn(error);
      return {};
    }
  },
  stringify: (data: AnyObj): string => {
    try {
      return JSON.stringify(data);
    } catch (error) {
      console.error(data);
      console.error(error);
      return '{}';
    }
  },
};

export const rand = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function arrEqual(baseArr: Array<unknown>, secondArr: Array<unknown>) {
  if (baseArr === secondArr) return true;
  if (baseArr.length !== secondArr.length) return false;
  for (var i = 0; i < baseArr.length; ++i) {
    if (baseArr[i] !== secondArr[i]) return false;
  }
  return true;
}

export const objIntersect = function objIntersect(
    baseObj: AnyObj, chunkObj: AnyObj,
): boolean {
  if (baseObj === null || baseObj === chunkObj) {
    return true;
  } else {
    return false;
  }
  const entries: [string, unknown][] = Object.entries(chunkObj);
  for (const [key, value] of entries) {
    if (typeof baseObj[key as keyof typeof baseObj] !== 'undefined') {
      if (typeof baseObj[key as keyof typeof baseObj] === 'object' &&
          typeof value === 'object') {
        if (baseObj[key as keyof typeof baseObj] as AnyObj instanceof Array &&
            value as AnyObj instanceof Array) {
          if (arrEqual(
            baseObj[key as keyof typeof baseObj] as AnyArr, value as AnyArr,
          )) {
            continue;
          } else {
            return false;
          }
        } else {
          if (objIntersect(
              baseObj[key as keyof typeof baseObj] as AnyObj, value as AnyObj,
          )) {
            continue;
          } else {
            return false;
          }
        }
      }
      if (baseObj[key as keyof typeof baseObj] !== value) {
        return false;
      }
    } else {
      return false;
    }
  }
  return true;
};
