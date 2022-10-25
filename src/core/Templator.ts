import {JSONWrapper} from './Utils';

type AnyObj = Array<unknown> | Record<string, unknown>;
type AnyContext = Record<string, unknown> | Window;
type Assets = Array<unknown>;

export class Templator {
  public context: AnyContext;
  private PP_PATTERN: RegExp;
  private PP_SUBPATTERN_JSONFUNC: RegExp;

  constructor(context: AnyContext | undefined = window) {
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
    const context: AnyContext = this.context;
    let matches: Array<string> | null;

    this.PP_SUBPATTERN_JSONFUNC.lastIndex = 0;
    if (matches = this.PP_SUBPATTERN_JSONFUNC.exec(pattern)) {
      const blockName = matches[1];
      const jsonStr = matches[2]
          .replace(/([{,"])\s*(\\[\\tn]+)\s*([},"])/g, '$1 $3')
          .replace(/&quot;/ig, '"'); // чистит пакости Парсела
      const unwrapRule = matches[3];
      let jsonObj: AnyObj = JSONWrapper.parse(jsonStr);

      if (typeof context[blockName as keyof AnyContext] === 'function') {
        const Block = context[blockName as keyof AnyContext];
        const blocksList: Array<unknown> = [];
        if (!(unwrapRule && jsonObj instanceof Array)) {
          jsonObj = [jsonObj];
        }
        for (const item of jsonObj) {
          let asset: AnyObj | string;
          if (Block.hasOwnProperty('prototype')) { // обычная функция/класс
            asset = new Block(item);
          } else { // стрелочная функция
            asset = context[blockName as keyof AnyContext](item);
          }
          if (typeof asset === 'object') {
            blocksList.push(asset);
          } else if (typeof asset === 'string') {
            const elementHolder = document.createElement('DIV');
            elementHolder.innerHTML = asset.trim();
            blocksList.push(...elementHolder.childNodes);
          }
        }
        return blocksList;
      }
    } else {
      return this.resolveVariable(pattern);
    }
    return null;
  }

  resolveAssets(str: string): Assets {
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

  resolveAssetsRecursive(str: string): Assets {
    const assets: Assets = this.resolveAssets(str);
    if (assets.length > 0 && !(assets.length === 1 && assets[0] === str)) {
      let asset: Assets;
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

  resolve(str: string | null): Assets {
    if (str !== null) {
      return this.resolveAssetsRecursive(str);
    } else {
      return [];
    }
  }
}
