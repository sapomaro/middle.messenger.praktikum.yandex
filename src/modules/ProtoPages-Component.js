import {EventBus} from '/src/modules/ProtoPages-EventBus.js';
import {Templator} from '/src/modules/ProtoPages-Templator.js';
import {rand, objIntersect} from '/src/modules/ProtoPages-Utils.js';

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

const protoblocks = {};

const ProtoBlock = function(context) {
  this.context = context;
  this.protouid = generateUid();
  protoblocks[this.protouid] = this;
  this.registerEvents();
};

ProtoBlock.prototype = {
  __ProtoBlock: true,
  ...EventBus.prototype,
  ...Templator.prototype,
  ...new Templator,
};

ProtoBlock.prototype.registerEvents = function() {
  this.listeners = {};
  this.nativeEventsList = [];
  this.on('propsUpdated', () => {
    this.replaceMultipleNodes(`[data-protouid=${this.protouid}]`, [this]);
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
};

ProtoBlock.prototype.setProps = function(obj, norefresh) {
  if (!objIntersect(this.context, obj)) {
    Object.assign(this.context, obj);
    if (!norefresh) {
      this.fire('propsUpdated');
    }
  }
};
ProtoBlock.prototype.getContent = function() {
  return document.querySelectorAll(`[data-protouid=${this.protouid}]`) ||
    this.element;
};

ProtoBlock.prototype.listDescendants = function(callback) {
  const elementNodes = this.getContent();
  if (!elementNodes) {
    return;
  }
  for (const node of elementNodes) {
    const nestedElementNodes = node.querySelectorAll('[data-protouid]');
    for (const nestedNode of nestedElementNodes) {
      const block = protoblocks[nestedNode.dataset.protouid];
      if (block) {
        callback(block);
      }
    }
  }
};

ProtoBlock.prototype.build = function() {
  this.fire('renderStart');
  this.element = this.buildNode(this.render, this.context, (node) => {
    if (node.nodeType === 1) {
      node.setAttribute('data-protouid', this.protouid);
    }
  });
  // traverse using local context of the block
  this.traverseChildren(this.element);
  this.fire('renderFinish');
  return this.element;
};

ProtoBlock.prototype.render = function() {};

export {ProtoBlock};
