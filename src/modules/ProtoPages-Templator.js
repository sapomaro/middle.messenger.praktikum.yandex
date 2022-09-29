import {ProtoBlock} from '/src/modules/ProtoPages-Component.js';

const ProtoPagesTemplator = {};
const PP = ProtoPagesTemplator;

PP.context = {};

const PP_PATTERN = /%\{\s?([^]*?)\s?\}%/g;
const PP_SUBPATTERN_JSONFUNC = /^([^( ]+)\(\s?([{[][^]*?[}\]])(\.\.\.)?\s?\)$/;

const PP_PARTIAL_PATTERN = /^<%>([^]*?)<\/%>$/g;
const PP_PARTIAL_TAG_OPEN = '<%>';
const PP_PARTIAL_TAG_CLOSE = '</%>';

const stripPartialTags = (str) => {
  return str.replace(/<\/?%>/g, '');
};

PP.JSON = {};
PP.JSON.parse = (data) => {
  try {
    return JSON.parse(data);
  } catch (error) {
    console.log(data);
    console.error(error);
    return {};
  }
};
PP.JSON.stringify = (data) => {
  try {
    return JSON.stringify(data);
  } catch (error) {
    console.log(data);
    console.error(error);
    return '{}';
  }
};

const resolvePattern2 = (pattern) => {
  let context = PP.context;
  let matches;
  let result;

  PP_SUBPATTERN_JSONFUNC.lastIndex = 0;
  if (matches = PP_SUBPATTERN_JSONFUNC.exec(pattern)) {
    const func = matches[1];
    // cleans up the mess from Parcel:
    const jsonStr = matches[2]
        .replace(/([{,"])\s*(\\[\\tn]+)\s*([},"])/g, '$1 $3')
        .replace(/&quot;/ig, '"');
    const unwrapRule = matches[3];

    const jsonObj = PP.JSON.parse(jsonStr);

    // new component

    if (typeof context[func] === 'function') {

//console.log(context[func] instanceof ProtoBlock);
      // elementFactory({ template, context, rules });

      if (unwrapRule && unwrapRule === '...' && jsonObj instanceof Array) {
        result = '';
        for (const item of jsonObj) {
          result += context[func](item);
        }
      } else {
        result = context[func](jsonObj);
      }
      result = PP_PARTIAL_TAG_OPEN + result + PP_PARTIAL_TAG_CLOSE;
    }
  } else {
    const props = pattern.split('.');
    for (let i = 0; i < props.length; ++i) {
      if (typeof context[props[i]] !== 'undefined') {
        context = context[props[i]];
      }
    }
    result = context;
    if (typeof result === 'function') {
      result = PP_PARTIAL_TAG_OPEN + result() + PP_PARTIAL_TAG_CLOSE;
    }
  }
  if (typeof result === 'string' || typeof result === 'number') {
    return result;
  }
  return null;
};

const resolveString = (str) => {
  PP_PATTERN.lastIndex = 0;
  if (!PP_PATTERN.test(str)) {
    return null;
  }
  let matches;
  let asset;
  const old = str;

  PP_PATTERN.lastIndex = 0;
  while (matches = PP_PATTERN.exec(str)) {
    asset = resolvePattern(matches[1].trim());
    if (asset !== null) {
      str = str.replace(matches[0], asset);
      // subtract pattern length to start next exec from new insertion
      // allows resolving nested patterns
      PP_PATTERN.lastIndex -= matches[0].length;
    }
  }
  if (str !== old) {
    return str;
  }
  return null;
};


const traverseText_old = (node) => {
  const str = resolveString(node.textContent);
  if (str !== null) {
    let matches;
    PP_PARTIAL_PATTERN.lastIndex = 0;
    if ((matches = PP_PARTIAL_PATTERN.exec(str.trim())) &&
        node.parentNode.childNodes.length === 1) {
      node.parentNode.innerHTML = stripPartialTags(matches[1]);
    } else {
      node.textContent = str;
    }
  }
};




const resolveVariable = (pattern, context) => {
  const props = pattern.split('.');
  let result;
  for (let i = 0; i < props.length; ++i) {
    if (typeof context[props[i]] !== 'undefined') {
      context = context[props[i]];
    }
  }
  result = context;
  if (typeof result === 'function') {
    result = result();
  }
  if (typeof result === 'string' || typeof result === 'number') {
    return result;
  }
  return null;
};

const resolvePattern = (pattern) => {
  const context = PP.context;
  let matches;
  let result;

  PP_SUBPATTERN_JSONFUNC.lastIndex = 0;
  if (matches = PP_SUBPATTERN_JSONFUNC.exec(pattern)) {
    const func = matches[1];
    // cleans up the mess from Parcel:
    const jsonStr = matches[2]
        .replace(/([{,"])\s*(\\[\\tn]+)\s*([},"])/g, '$1 $3')
        .replace(/&quot;/ig, '"');
    const unwrapRule = matches[3];

    const jsonObj = PP.JSON.parse(jsonStr);

    // new component

    if (typeof context[func] === 'function') {

//console.log(context[func] instanceof ProtoBlock);
      // elementFactory({ template, context, rules });
      const elem = document.createElement('SPAN');
      elem.innerHTML = '%{test}%';
      return elem;

    }
  } else {
    return resolveVariable(pattern, context);
  }
  
  return null;
};

const resolveAssets = (str) => {
  PP_PATTERN.lastIndex = 0;
  if (!PP_PATTERN.test(str)) {
    return null;
  }
  const assets = [];
  //let isStr = true;
  let patternAsset;
  let textAsset = '';
  let textIndex = 0;
  let patternIndex = 0;
  let matches;
  PP_PATTERN.lastIndex = 0;
  while (matches = PP_PATTERN.exec(str)) {
    patternIndex = PP_PATTERN.lastIndex - matches[0].length;
    if (textIndex !== patternIndex) {
      textAsset = str.slice(textIndex, patternIndex);
      assets.push(textAsset);
    }
    textIndex = PP_PATTERN.lastIndex;
    patternAsset = resolvePattern(matches[1].trim());

    if (patternAsset !== null) {
      assets.push(patternAsset);
      //if (typeof patternAsset !== 'string') {
      //  isStr = false;
      //}
    }
  }
  if (str.length > textIndex) {
    textAsset = str.slice(textIndex, str.length - 1);
    assets.push(textAsset);
  }
  if (assets.length > 0) {
    //if (isStr) {
    //  assets = [ assets.join('') ];
    //}
    return assets;
  }
  return null;
};



const parseText = function parseText(str) {
  const assets = resolveAssets(str);
  if (assets !== null) {
    let asset;
    for (let i = 0; i < assets.length; ++i) {
      if (typeof assets[i] === 'string') {
        asset = parseText(assets[i]);
        assets.splice(i, 1, ...asset);
        i += asset.length - 1;
      }
    }
    return assets;
  }
  return [str];
};



const traverseText = (node) => {
  const assets = parseText(node.textContent);
  
  if (assets.length === 1 && assets[0] === node.textContent) {
    return null;
  } else {
    const fragment = document.createDocumentFragment();
    let elem;
    for (const asset of assets) {
      if (typeof asset === 'string') {
        elem = document.createTextNode(asset);
      }
      else {
        elem = asset;
        traverseChildren(elem);
      }
      fragment.appendChild(elem);
    }
    fragment.normalize();
    node.parentNode.replaceChild(fragment, node);
  }
};



const traverseChildren = (node) => {
  if (!node.childNodes) {
    return;
  }
  for (let i = node.childNodes.length - 1; i >= 0; --i) {
    if (node.childNodes[i].nodeType === 1) {
      traverseAttributes(node.childNodes[i]);
      traverseChildren(node.childNodes[i]);
    } else if (node.childNodes[i].nodeType === 3 &&
               node.tagName !== 'SCRIPT') {
      traverseText(node.childNodes[i]);
    }
  }
};

const traverseAttributes = (node) => {
  for (let i = node.attributes.length - 1; i >= 0; --i) {
    const attr = resolveString(node.attributes[i].nodeValue);
    if (attr !== null) {
      node.setAttribute(node.attributes[i].nodeName, attr);
    }
  }
};

PP.compileAll = (context = window) => {
  PP.context = context;
  traverseChildren(document.head);
  traverseChildren(document.body);
};

export {ProtoPagesTemplator};
