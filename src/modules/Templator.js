import {JSONWrapper} from '/src/modules/Utils';

export class Templator {
  constructor(context = window) {
    this.context = context;
    this.PP_PATTERN =
      /%\{\s?([^]*?)\s?\}%/g;
    this.PP_SUBPATTERN_JSONFUNC =
      /^([^( ]+)\(\s?([{[][^]*?[}\]])(\.\.\.)?\s?\)$/;
  }

  resolveVariable(pattern) {
    let context = this.context;
    const props = pattern.split('.');
    for (let i = 0; i < props.length; ++i) {
      if (typeof context[props[i]] !== 'undefined') {
        context = context[props[i]];
      } else {
        return null;
      }
    }
    return context;
  }

  resolveSubPattern(pattern) {
    const context = this.context;
    let matches;

    this.PP_SUBPATTERN_JSONFUNC.lastIndex = 0;
    if (matches = this.PP_SUBPATTERN_JSONFUNC.exec(pattern)) {
      const blockName = matches[1];
      // cleans up the mess from Parcel:
      const jsonStr = matches[2]
          .replace(/([{,"])\s*(\\[\\tn]+)\s*([},"])/g, '$1 $3')
          .replace(/&quot;/ig, '"');
      const unwrapRule = matches[3];
      let jsonObj = JSONWrapper.parse(jsonStr);

      if (typeof context[blockName] === 'function') {
        const Block = context[blockName];
        const blocksList = [];
        if (!(unwrapRule && jsonObj instanceof Array)) {
          jsonObj = [jsonObj];
        }
        for (const item of jsonObj) {
          let asset;
          if (Block.hasOwnProperty('prototype')) { // normal function or class
            asset = new Block(item);
          } else { // arrow function
            asset = context[blockName](item);
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

  resolveString(str) { // for plain text nodes
    this.PP_PATTERN.lastIndex = 0;
    if (!this.PP_PATTERN.test(str)) {
      return null;
    }
    let matches;
    let asset;
    const old = str;
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

  resolveAssets(str) {
    this.PP_PATTERN.lastIndex = 0;
    if (!this.PP_PATTERN.test(str)) {
      return null;
    }
    const assets = [];
    let patternAsset;
    let textAsset = '';
    let textIndex = 0;
    let patternIndex = 0;
    let matches;
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
    if (assets.length > 0) {
      return assets;
    }
    return null;
  }

  resolveAssetsRecursive(str) {
    const assets = this.resolveAssets(str);
    if (assets && !(assets.length === 1 && assets[0] === str)) {
      let asset;
      for (let i = 0; i < assets.length; ++i) {
        if (typeof assets[i] === 'string') {
          asset = this.resolveAssetsRecursive(assets[i]);
          assets.splice(i, 1, ...asset);
          i += asset.length - 1;
        }
      }
      return assets;
    }
    return [str];
  }

  resolve(str) {
    return this.resolveAssetsRecursive(str);
  }
}

