import {cloneDeep} from '../modules/Utils';

export const sanitizeAll = <T>(props: T): T => {
  return cloneDeep(props, <TT>(value: TT): TT => {
    if (typeof value === 'string') {
      return sanitize(value) as TT;
    }
    return value;
  });
};

export const sanitize = (str: string) => {
  return str.trim()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
      .replace(/\\/g, '&#8726;');
};
