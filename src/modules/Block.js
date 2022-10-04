import {EventBus} from '/src/modules/EventBus';
import {Templator} from '/src/modules/Templator';
import {rand, objIntersect} from '/src/modules/Utils';

const uids = {};

const generateUid = () => {
  let uid = '';
  let num;
  do {
    num = rand(1, 99999);
    num2 = rand(1, 99999);
    uid = `pp_${num}_${num2}_uid`;
  } while (uids[uid]);
  return uid;
};

const instancesOfBlock = {};

export class Block extends EventBus {
  constructor(props = {}) {
    super();
    this.props = props;
    this.blockuid = generateUid();
    instancesOfBlock[this.blockuid] = this;
    this.templator = new Templator(this.props);
    this.registerEvents();
  }

  registerEvents() {
    this.listeners = {};
    this.nativeEventsList = [];
    this.on('refresh, propsUpdated', () => {
      this.replaceMultipleNodes(`[data-blockuid=${this.blockuid}]`, [this]);
    });
    this.on('eventAttached', ({node, eventType, callback}) => {
      this.nativeEventsList.push({node, eventType, callback});
    });
    this.on('renderStart', () => {
      for (const {node, eventType, callback} of this.nativeEventsList) {
        node.removeEventListener(eventType, callback);
      }
      this.nativeEventsList = [];
    });
  }

  setProps(obj, norefresh) {
    if (!objIntersect(this.props, obj)) {
      Object.assign(this.props, obj);
      if (!norefresh) {
        this.fire('propsUpdated');
      }
    }
  }

  refresh() {
    this.fire('refresh');
  }

  getContent() {
    return document.querySelectorAll(`[data-blockuid=${this.blockuid}]`) ||
      this.element;
  }

  listDescendants(callback) {
    const elementNodes = this.getContent();
    if (!elementNodes) {
      return;
    }
    for (const node of elementNodes) {
      const nestedElementNodes = node.querySelectorAll('[data-blockuid]');
      for (const nestedNode of nestedElementNodes) {
        const block = instancesOfBlock[nestedNode.dataset.blockuid];
        if (block) {
          callback(block);
        }
      }
    }
  }

  build() {
    this.fire('renderStart');
    this.element = this.buildNode(this.render, this.props, (node) => {
      if (node.nodeType === 1) {
        node.setAttribute('data-blockuid', this.blockuid);
      }
    });
    // traverse using local context of the block
    this.traverseChildren(this.element);
    this.fire('renderFinish');
    return this.element;
  }

  render() {}

  buildNode(renderer, props = {}, callback) {
    const elementHolder = document.createElement('DIV');
    elementHolder.innerHTML = renderer(props).trim();
    const fragment = document.createDocumentFragment();
    while (elementHolder.childNodes.length !== 0) {
      const node = elementHolder.childNodes[0];
      if (callback) {
        callback(node);
      }
      fragment.appendChild(node);
    }
    return fragment;
  }

  replaceMultipleNodes(selector, assets) {
    const nodeList = document.querySelectorAll(selector);
    if (nodeList && nodeList.length) {
      for (let i = nodeList.length - 1; i > 0; --i) {
        nodeList[i].parentNode.removeChild(nodeList[i]);
      }
      this.replaceNode(nodeList[0], assets);
    }
  }

  resolveNode(asset) {
    let elem = null;
    if (typeof asset === 'string') {
      elem = document.createTextNode(asset);
    } else if (typeof asset === 'function') {
      elem = this.buildNode(asset);
      this.traverseChildren(elem);
    } else if (typeof asset === 'object' && asset.blockuid) {
      elem = asset.build();
      // traverse using context of the parent
      this.traverseChildren(elem);
    } else if (asset.nodeType &&
              (asset.nodeType === 1 || asset.nodeType === 11)) {
      elem = asset;
      this.traverseChildren(elem);
    }
    return elem;
  }

  replaceNode(node, assets) {
    const fragment = document.createDocumentFragment();
    const blocksList = [];
    for (const asset of assets) {
      if (typeof asset === 'object' && asset.blockuid) {
        blocksList.push(asset);
      }
      const elem = this.resolveNode(asset);
      fragment.appendChild(elem);
    }
    fragment.normalize();
    node.parentNode.replaceChild(fragment, node);
    for (const block of blocksList) {
      block.fire('planted');
    }
  }

  traverseText(node) {
    const assets = this.templator.resolve(node.textContent);
    if (assets.length === 1 && assets[0] === node.textContent) {
      return null;
    } else {
      this.replaceNode(node, assets);
    }
  }

  traverseChildren(node) {
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
  }

  traverseAttributes(node) {
    for (let i = node.attributes.length - 1; i >= 0; --i) {
      const attrName = node.attributes[i].nodeName;
      const attrValue = node.attributes[i].nodeValue;
      if (attrName.slice(0, 2) === 'on') { // event attachment
        const [asset] = this.templator.resolve(attrValue);
        if (typeof asset === 'function') {
          const eventType = attrName.slice(2);
          const callback = asset;
          node.addEventListener(eventType, callback);
          node.removeAttribute(attrName);
          this.fire('eventAttached', {node, eventType, callback});
        }
      } else {
        const [asset] = this.templator.resolve(attrValue);
        if (asset !== 'attrValue') {
          node.setAttribute(attrName, asset);
        }
      }
    }
  }

  renderToBody() {
    EventBus.on('load', () => {
      this.traverseChildren(document.head);
      document.body.innerHTML = '';
      const elem = this.build();
      // traverse using global context of the app
      this.traverseChildren(elem);
      document.body.appendChild(elem);

      this.fire('mounted');
      this.listDescendants((block) => {
        block.fire('mounted');
      });
    });
  }
}

