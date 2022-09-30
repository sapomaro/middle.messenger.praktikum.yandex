import {EventBus} from '/src/modules/ProtoPages-EventBus.js';
import {Templator} from '/src/modules/ProtoPages-Templator.js';

const ProtoPagesComponent = {};
const PP = ProtoPagesComponent;

const ProtoBlock = function({ context, rules }) {
  this.context = context;
  this.rules = rules;
  //return this.element;
};
ProtoBlock.prototype = {
  __ProtoBlock: true,
  ...EventBus.prototype,
  ...Templator.prototype,
  ...new Templator,
};
ProtoBlock.prototype.init = function() {
  this.buildElement();
  this.traverseChildren(this.element);
};
ProtoBlock.prototype.buildElement = function() {
  const elementHolder = document.createElement('div');
  let htmlCode = '';
  if (this.rules.unwrap && this.context instanceof Array) {
    for (const item of this.context) {
      htmlCode += this.render(item);
    }
  } else {
    htmlCode = this.render(this.context);
  }
  elementHolder.innerHTML = htmlCode;
  const fragment = document.createDocumentFragment();
  while (elementHolder.childNodes.length !== 0) {
    fragment.appendChild(elementHolder.childNodes[0]);
  }
  this.element = fragment;
};
ProtoBlock.prototype.detachEvents = function() {
  
};

/*

class ProtoBlock extends EventBus {
  constructor({ context, rules }) {
    super();
    
    this.context = context;
    this.rules = rules;
    
    this.buildElement();
    
    
    return this.element;
  }

  
  buildElement() {
    const elementHolder = document.createElement('div');
    let htmlCode = '';
    if (this.rules.unwrap && this.context instanceof Array) {
      for (const item of this.context) {
        htmlCode += this.render(item);
      }
    } else {
      htmlCode = this.render(this.context);
    }
    elementHolder.innerHTML = htmlCode;
    const fragment = document.createDocumentFragment();
    while (elementHolder.childNodes.length !== 0) {
      fragment.appendChild(elementHolder.childNodes[0]);
    }
    this.element = fragment;
  }

  setId() {
    
  }

  //traverseElement
  //injectEventHandlers

  swapElements() {
    
    //this.fire('mounted');
  }

  render() {}
}
*/

PP.ProtoBlock = ProtoBlock;

export { ProtoPagesComponent, ProtoBlock };