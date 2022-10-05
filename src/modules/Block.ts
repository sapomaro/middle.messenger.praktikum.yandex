import {EventBus} from './EventBus';
import {Templator} from './Templator';
import {rand, objIntersect} from './Utils';

const uids = {};

const generateUid = () => {
  let uid = '';
  let num;
  do {
    num = rand(1, 99999);
    num2 = rand(1, 99999);
    uid = `pp_${num}_${num2}_uid`;
  } while (uids[uid]);
  uids[uid] = true;
  return uid;
};

const instancesOfBlock = {};

export class Block<P = any> extends EventBus {

  static EVENTS = {
    PREPARE: 'preparing',
    RENDER: 'rendered',
    MOUNT: 'mounted',
    UPDATE: 'updated',
  };

  private blockuid: string;
  private templator: Templator;
  private listeners: Record<string, any>;
  private nativeEventsList: Array<Record<string, any>>;
  public props: P;

  constructor(props?: P = {}) {
    super();
    this.props = props;
    this.blockuid = generateUid();
    instancesOfBlock[this.blockuid] = this;
    this.templator = new Templator(this.props);
    this.registerEvents();
  }

  registerEvents(): void {
    this.listeners = {};
    this.nativeEventsList = [];
    this.on(Block.EVENTS.UPDATE, () => {
      this.replaceMultipleNodes(`[data-blockuid=${this.blockuid}]`, [this]);
    });
    this.on('eventAttached', ({node, eventType, callback}) => {
      this.nativeEventsList.push({node, eventType, callback});
    });
    this.on(Block.EVENTS.PREPARE, () => {
      for (const {node, eventType, callback} of this.nativeEventsList) {
        node.removeEventListener(eventType, callback);
      }
      this.nativeEventsList = [];
      this.listDescendants((block) => {
        block.fire(Block.EVENTS.PREPARE);
      });
    });
  }

  setProps(obj, norefresh): void {
    if (!objIntersect(this.props, obj)) {
      Object.assign(this.props, obj);
      if (!norefresh) {
        this.fire(Block.EVENTS.UPDATE);
      }
    }
  }

  refresh(): void {
    this.fire(Block.EVENTS.UPDATE);
  }

  isInDOM(): boolean {
    return (document.querySelector(`[data-blockuid=${this.blockuid}]`) !== null);
  }

  getContent() {
    return document.querySelectorAll(`[data-blockuid=${this.blockuid}]`) ||
      this.element;
  }

  listDescendants(callback): void {
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
    this.fire(Block.EVENTS.PREPARE);
    this.element = this.buildNode(this.render, this.props, (node) => {
      if (node.nodeType === 1) {
        node.setAttribute('data-blockuid', this.blockuid);
      }
    });
    // traverse using local context of the block
    this.traverseChildren(this.element);
    this.fire(Block.EVENTS.RENDER);
    return this.element;
  }

  render(): void {}

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

  replaceMultipleNodes(selector, assets): void {
    const nodeList = document.querySelectorAll(selector);
    if (nodeList && nodeList.length) {
      for (let i = nodeList.length - 1; i > 0; --i) {
        nodeList[i].parentNode.removeChild(nodeList[i]);
      }
      this.replaceNode(nodeList[0], assets);
    }
  }

  resolveNode(asset): unknown {
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

  replaceNode(node, assets): void {
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
      if (block.isInDOM()) {
        block.fire(Block.EVENTS.MOUNT);
      }
    }
  }

  traverseText(node): void {
    const assets = this.templator.resolve(node.textContent);
    if (assets.length === 1 && assets[0] === node.textContent) {
      return null;
    } else {
      this.replaceNode(node, assets);
    }
  }

  traverseChildren(node): void {
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

  traverseAttributes(node): void {
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

  renderToBody(): void {
    EventBus.on('load', () => {
      this.traverseChildren(document.head);
      document.body.innerHTML = '';
      const elem = this.build();
      // traverse using global context of the app
      this.traverseChildren(elem);
      document.body.appendChild(elem);

      this.fire(Block.EVENTS.MOUNT);
      this.listDescendants((block) => {
        block.fire(Block.EVENTS.MOUNT);
      });
    });
  }
}

