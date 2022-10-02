import {JSONWrapper} from '/src/modules/ProtoPages-Utils.js';

const Templator = function(context = window) {
  this.context = context;
  this.PP_PATTERN = /%\{\s?([^]*?)\s?\}%/g;
  this.PP_SUBPATTERN_JSONFUNC = /^([^( ]+)\(\s?([{[][^]*?[}\]])(\.\.\.)?\s?\)$/;
};

Templator.prototype.resolveVariable = function(pattern) {
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
};

Templator.prototype.resolvePattern = function(pattern) {
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
        if (Block.prototype && Block.prototype.__ProtoBlock) {
          blocksList.push(new Block(item));
        } else {
          blocksList.push(this.buildNode(Block, item));
        }
      }
      return blocksList;
    }
  } else {
    return this.resolveVariable(pattern);
  }
  return null;
};

Templator.prototype.resolveString = function(str) { // for plain text nodes
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
};

Templator.prototype.resolveAssets = function(str) {
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
    patternAsset = this.resolvePattern(matches[1].trim());

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
    textAsset = str.slice(textIndex, str.length - 1);
    assets.push(textAsset);
  }
  if (assets.length > 0) {
    return assets;
  }
  return null;
};

Templator.prototype.buildNode = function(templator, context = {}, callback) {
  const elementHolder = document.createElement('div');
  elementHolder.innerHTML = templator(context).trim();
  const fragment = document.createDocumentFragment();
  while (elementHolder.childNodes.length !== 0) {
    const node = elementHolder.childNodes[0];
    if (callback) {
      callback(node);
    }
    fragment.appendChild(node);
  }
  return fragment;
};

Templator.prototype.replaceMultipleNodes = function(selector, assets) {
  const nodeList = document.querySelectorAll(selector);
  if (nodeList && nodeList.length) {
    for (let i = nodeList.length - 1; i > 0; --i) {
      nodeList[i].parentNode.removeChild(nodeList[i]);
    }
    this.replaceNode(nodeList[0], assets);
  }
};

Templator.prototype.resolveNode = function(asset) {
  let elem = null;
  if (typeof asset === 'string') {
    elem = document.createTextNode(asset);
  } else if (typeof asset === 'function') {
    elem = this.buildNode(asset);
    this.traverseChildren(elem);
  } else if (typeof asset === 'object' && asset.__ProtoBlock) {
    elem = asset.build();
    // traverse using global context of the app
    this.traverseChildren(elem);
  } else if (asset.nodeType &&
            (asset.nodeType === 1 || asset.nodeType === 11)) {
    elem = asset;
    this.traverseChildren(elem);
  }
  return elem;
};

Templator.prototype.replaceNode = function(node, assets) {
  const fragment = document.createDocumentFragment();
  const blocksList = [];
  for (const asset of assets) {
    if (typeof asset === 'object' && asset.__ProtoBlock) {
      blocksList.push(asset);
    }
    const elem = this.resolveNode(asset);
    fragment.appendChild(elem);
  }
  fragment.normalize();
  node.parentNode.replaceChild(fragment, node);
  for (const block of blocksList) {
    block.fire('mounted');
  }
};

Templator.prototype.parseText = function(str) {
  const assets = this.resolveAssets(str);
  if (assets && !(assets.length === 1 && assets[0] === str)) {
    let asset;
    for (let i = 0; i < assets.length; ++i) {
      if (typeof assets[i] === 'string') {
        asset = this.parseText(assets[i]);
        assets.splice(i, 1, ...asset);
        i += asset.length - 1;
      }
    }
    return assets;
  }
  return [str];
};

Templator.prototype.traverseText = function(node) {
  const assets = this.parseText(node.textContent);
  if (assets.length === 1 && assets[0] === node.textContent) {
    return null;
  } else {
    this.replaceNode(node, assets);
  }
};

Templator.prototype.traverseChildren = function(node) {
  if (!node.childNodes) {
    return;
  }
  for (let i = node.childNodes.length - 1; i >= 0; --i) {
    if (node.childNodes[i].nodeType === 1) {
      this.traverseAttributes(node.childNodes[i]);
      this.traverseChildren(node.childNodes[i]);
    } else if (node.childNodes[i].nodeType === 3 &&
               node.tagName !== 'SCRIPT') {
      this.traverseText(node.childNodes[i]);
    }
  }
};

Templator.prototype.traverseAttributes = function(node) {
  for (let i = node.attributes.length - 1; i >= 0; --i) {
    const attrName = node.attributes[i].nodeName;
    const attrValue = node.attributes[i].nodeValue;
    if (attrName.slice(0, 2) === 'on') { // event attachment
      const asset = this.resolveAssets(attrValue);
      if (asset && typeof asset[0] === 'function') {
        const eventType = attrName.slice(2);
        const callback = asset[0];
        node.addEventListener(eventType, callback);
        node.removeAttribute(attrName);
        this.fire('eventAttached', {node, eventType, callback});
      }
    } else {
      const str = this.resolveString(attrValue);
      if (str !== null) {
        node.setAttribute(attrName, str);
      }
    }
  }
};

export {Templator};
