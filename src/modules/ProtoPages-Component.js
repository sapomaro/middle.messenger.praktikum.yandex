import {EventBus} from '/src/modules/ProtoPages-EventBus.js';
import {Templator} from '/src/modules/ProtoPages-Templator.js';

const ProtoPagesComponent = {};
const PP = ProtoPagesComponent;


const uids = {};
const generateUid = () => {
  const min = 1;
  const max = 99999;
  let uid = '';
  let num;
  do {
    num = Math.floor(Math.random() * (max - min + 1)) + min;
    uid = `pp${num}`;
  } while (uids[uid]);
  return uid;
};


const ProtoBlock = function({ context, rules }) {
  this.context = context;
  this.rules = {
    ...rules,
    uid: generateUid(),
  };
  this.listeners = {};
};
ProtoBlock.prototype = {
  __ProtoBlock: true,
  ...EventBus.prototype,
  ...Templator.prototype,
  ...new Templator,
};
ProtoBlock.prototype.setProps = function(obj) {
  Object.assign(this.context, obj);
  this.refresh();
};
ProtoBlock.prototype.build = function() {
  this.element = this.buildNode(this.render, this.context, this.rules);
  this.traverseChildren(this.element);
  this.fire('built');
};
ProtoBlock.prototype.refresh = function() {
  this.build();
  this.replaceMultipleNodes(`[data-proto-uid=${this.rules.uid}]`, [this]);
};
ProtoBlock.prototype.detachEvents = function() {
  
};

PP.ProtoBlock = ProtoBlock;

export { ProtoPagesComponent, ProtoBlock };