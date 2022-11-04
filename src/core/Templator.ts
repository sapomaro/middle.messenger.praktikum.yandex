import {JSONWrapper} from './Utils';

import type {JSONable, Fn} from '../constants/types';

type ContextT = JSONable | Window;
type AssetsT = Array<unknown>;

export class Templator {
  public context: ContextT;
  private PP_PATTERN: RegExp;
  private PP_SUBPATTERN_JSONFUNC: RegExp;

  constructor(context: ContextT | undefined = window) {
    this.context = context;
    this.PP_PATTERN =
      /%\{\s?([^]*?)\s?\}%/g;
    this.PP_SUBPATTERN_JSONFUNC =
      /^([^( ]+)\(\s?([{[][^]*?[}\]])(\.\.\.)?\s?\)$/;
  }

  resolveVariable(pattern: string): unknown {
    let currentContext: unknown = this.context;
    const props = pattern.split('.');
    for (const key of props) {
      if (currentContext === null) {
        return null;
      }
      if (typeof currentContext !== 'object' &&
          typeof currentContext !== 'function') {
        return null;
      }
      if (!(key in currentContext)) {
        return null;
      }
      currentContext = currentContext[key as keyof typeof currentContext];
    }
    return currentContext;
  }

  resolveSubPattern(pattern: string): unknown | null {
    const context: ContextT = this.context;
    let matches: Array<string> | null;

    this.PP_SUBPATTERN_JSONFUNC.lastIndex = 0;
    if (matches = this.PP_SUBPATTERN_JSONFUNC.exec(pattern)) {
      const blockName = matches[1];
      const jsonStr = matches[2]
          .replace(/([{,"])\s*(\\[\\tn]+)\s*([},"])/g, '$1 $3')
          .replace(/&quot;/ig, '"'); // чистит пакости Парсела
      const unwrapRule = matches[3];
      let jsonObj: JSONable = JSONWrapper.parse(jsonStr);

      const block = context[blockName as keyof ContextT] as Fn;
      if (typeof block === 'function') {
        const blocksList: Array<unknown> = [];
        if (!(unwrapRule && jsonObj instanceof Array)) {
          jsonObj = [jsonObj];
        }
        for (const subcontext of jsonObj) {
          if (block.hasOwnProperty('prototype')) {
            const Block = block as unknown as {
              new (subcontext: unknown): typeof Block;
            };
            blocksList.push(new Block(subcontext));
          }
        }
        return blocksList;
      }
    } else {
      return this.resolveVariable(pattern);
    }
    return null;
  }

  resolveAssets(str: string): AssetsT {
    this.PP_PATTERN.lastIndex = 0;
    if (!this.PP_PATTERN.test(str)) {
      return [];
    }
    const assets = [];
    let patternAsset: unknown;
    let textAsset = '';
    let textIndex = 0;
    let patternIndex = 0;
    let matches: Array<string> | null;
    this.PP_PATTERN.lastIndex = 0;
    while (matches = this.PP_PATTERN.exec(str)) {
      patternIndex = this.PP_PATTERN.lastIndex - matches[0].length;
      if (textIndex !== patternIndex) {
        textAsset = str.slice(textIndex, patternIndex);
        assets.push(textAsset);
      }
      textIndex = this.PP_PATTERN.lastIndex;
      patternAsset = this.resolveSubPattern(matches[1].trim());

      if (patternAsset !== null) {
        if (patternAsset instanceof Array) {
          assets.push(...patternAsset);
        } else {
          assets.push(patternAsset);
        }
      } else {
        assets.push(matches[0]);
      }
    }
    if (str.length > textIndex) {
      textAsset = str.slice(textIndex, str.length);
      assets.push(textAsset);
    }
    return assets;
  }

  resolveAssetsRecursive(str: string): AssetsT {
    const assets: AssetsT = this.resolveAssets(str);
    if (assets.length > 0 && !(assets.length === 1 && assets[0] === str)) {
      let asset: AssetsT;
      for (let i = 0; i < assets.length; ++i) {
        if (typeof assets[i] === 'string') {
          asset = this.resolveAssetsRecursive(assets[i] as string);
          if (asset !== null) {
            assets.splice(i, 1, ...asset);
            i += asset.length - 1;
          }
        }
      }
      return assets;
    }
    return [str];
  }

  resolve(str: string | null): AssetsT {
    if (str !== null) {
      return this.resolveAssetsRecursive(str);
    } else {
      return [];
    }
  }
}
