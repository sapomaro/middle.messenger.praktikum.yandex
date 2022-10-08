import {JSONWrapper} from './Utils';

type AnyObj = Array<unknown> | Record<string, unknown>;
type AnyContext = Record<string, unknown> | Window;
type Assets = Array<unknown>;

export class Templator {
  public context: AnyObj | Window;
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
    let context: unknown = this.context;
    const props = pattern.split('.');
    for (let i = 0; i < props.length; ++i) {
      if (context !== null &&
          (typeof context === 'object' || typeof context === 'function') &&
          props[i] in context) {
        context = context[props[i] as keyof typeof context];
      } else {
        return null;
      }
    }
    return context;
  }

  resolveSubPattern(pattern: string): unknown | null {
    const context: AnyContext = this.context;
    let matches: Array<string> | null;

    this.PP_SUBPATTERN_JSONFUNC.lastIndex = 0;
    if (matches = this.PP_SUBPATTERN_JSONFUNC.exec(pattern)) {
      const blockName = matches[1];
      // cleans up the mess from Parcel:
      const jsonStr = matches[2]
          .replace(/([{,"])\s*(\\[\\tn]+)\s*([},"])/g, '$1 $3')
          .replace(/&quot;/ig, '"');
      const unwrapRule = matches[3];
      let jsonObj: AnyObj = JSONWrapper.parse(jsonStr);

      if (typeof context[blockName as keyof AnyContext] === 'function') {
        const Block = context[blockName as keyof AnyContext];
        const blocksList: Array<unknown> = [];
        if (!(unwrapRule && jsonObj instanceof Array)) {
          jsonObj = [jsonObj];
        }
        for (const item of jsonObj as Array<unknown>) {
          let asset: AnyObj | string;
          if (Block.hasOwnProperty('prototype')) { // normal function or class
            asset = new Block(item);
          } else { // arrow function
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

  resolveString(str: string): string | null { // for plain text nodes
    this.PP_PATTERN.lastIndex = 0;
    if (!this.PP_PATTERN.test(str)) {
      return null;
    }
    let matches: Array<string> | null;
    let asset: unknown;
    const old: string = str;
    this.PP_PATTERN.lastIndex = 0;
    while (matches = this.PP_PATTERN.exec(str)) {
      asset = this.resolveVariable(matches[1].trim());
      if (asset !== null && typeof asset === 'string') {
        str = str.replace(matches[0], asset);
        // subtract pattern length to start next exec from new insertion
        // allows resolving nested patterns
        this.PP_PATTERN.lastIndex -= matches[0].length;
      }
    }
    if (str !== old) {
      return str;
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

