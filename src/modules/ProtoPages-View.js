import {EventBus} from '/src/modules/ProtoPages-EventBus.js';
import {Templator} from '/src/modules/ProtoPages-Templator.js';
import {JSONWrapper} from '/src/modules/ProtoPages-Utils.js';

const ProtoView = function(layoutBuilder) {
  this.templator = new Templator();
  this.listeners = {};
  EventBus.on('init', () => {
    layoutBuilder();
  });
};

ProtoView.JSON = JSONWrapper;

ProtoView.prototype = {...EventBus};

ProtoView.prototype.use = function(moreContext) {
  this.templator.context = {
    ...this.templator.context,
    ...moreContext,
  };
  return this.templator.context;
};

ProtoView.prototype.compile = function(context = window) {
  EventBus.on('load', () => {
    if (context && context !== window) {
      this.templator.context = context;
    }
    this.templator.traverseChildren(document.head);
    this.templator.traverseChildren(document.body);
    this.fire('compiled');
  });
};

ProtoView.prototype.render = function() {
  this.compile();
};

export {ProtoView};
