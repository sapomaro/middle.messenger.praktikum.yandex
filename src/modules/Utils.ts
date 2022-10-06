export const JSONWrapper = {
  parse: (data: string): Object => {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.warn(data);
      console.warn(error);
      return {};
    }
  },
  stringify: (data: Object): string => {
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
    baseObj: Object, chunkObj: Object
  ): boolean {
  const entries: [string, any][] = Object.entries(chunkObj);
  for (const [key, value] of entries) {
    if (typeof baseObj[key as keyof Object] !== 'undefined') {
      if (typeof baseObj[key as keyof Object] === 'object' &&
          typeof value === 'object') {
        if (objIntersect(baseObj[key as keyof Object], value)) {
          continue;
        } else {
          return false;
        }
      }
      if (baseObj[key as keyof Object] !== value) {
        return false;
      }
    } else {
      return false;
    }
  }
  return true;
};
