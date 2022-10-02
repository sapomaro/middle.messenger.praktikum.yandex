import {EventBus} from '/src/modules/ProtoPages-EventBus.js';
import {Templator} from '/src/modules/ProtoPages-Templator.js';

const ProtoPagesComponent = {};
const PP = ProtoPagesComponent;


const rand = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

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


const objIntersect = function objIntersect(baseObj, chunkObj) {
  const entries = Object.entries(chunkObj);
  for (const [key, value] of entries) {
    if (typeof baseObj[key] !== 'undefined') {
      if (typeof baseObj[key] === 'object' && typeof value === 'object') {
        if (objIntersect(baseObj[key], value)) {
          continue;
        } else {
          return false;
        }
      }
      if (baseObj[key] !== value) {
        return false;
      }
    } else {
      return false;
    }
  }
  return true;
}

const protoblocks = {};

const ProtoBlock = function(context) {
  this.context = context;
  this.protouid = generateUid();
  protoblocks[this.protouid] = this;
  this.listeners = {};
};
ProtoBlock.prototype = {
  __ProtoBlock: true,
  ...EventBus.prototype,
  ...Templator.prototype,
  ...new Templator,
};
ProtoBlock.prototype.setProps = function(obj, norefresh) {
  if (!objIntersect(this.context, obj)) {
    Object.assign(this.context, obj);
    if (!norefresh) {
      this.refresh();
    }
  }
};
ProtoBlock.prototype.listDescendants = function(callback) {
  const nodeList = document.querySelectorAll(`[data-protouid=${this.protouid}]`) ||
    this.element;
  if (!nodeList) {
    return;
  }
  for (const node of nodeList) {
    const nestedNodeList = node.querySelectorAll('[data-protouid]');
    for (const nestedNode of nestedNodeList) {
      const block = protoblocks[nestedNode.dataset.protouid];
      if (block) {
        callback(block);
      }
    }
  }
};
ProtoBlock.prototype.build = function() {
  this.element = this.buildNode(this.render, this.context, (node) => {
    if (node.nodeType === 1) {
      node.setAttribute('data-protouid', this.protouid);
    }
  });
  this.traverseChildren(this.element);
  this.fire('built');
  return this.element;
};
ProtoBlock.prototype.refresh = function() {
  this.replaceMultipleNodes(`[data-protouid=${this.protouid}]`, [this]);
};

PP.ProtoBlock = ProtoBlock;

export {ProtoPagesComponent, ProtoBlock};
