type AnyObj = Array<unknown> | Record<string, unknown>;

export const JSONWrapper = {
  parse: (data: string): AnyObj => {
    try {
      return JSON.parse(data);
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

export const objIntersect = function objIntersect(
    baseObj: AnyObj, chunkObj: AnyObj,
): boolean {
  const entries: [string, unknown][] = Object.entries(chunkObj);
  for (const [key, value] of entries) {
    if (typeof baseObj[key as keyof typeof baseObj] !== 'undefined') {
      if (typeof baseObj[key as keyof typeof baseObj] === 'object' &&
          typeof value === 'object') {
        if (objIntersect(baseObj[key as keyof typeof baseObj] as AnyObj, value as AnyObj)) {
          continue;
        } else {
          return false;
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
