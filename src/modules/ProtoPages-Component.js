import {EventBus} from '/src/modules/ProtoPages-EventBus.js';

const ProtoPagesComponent = {};
const PP = ProtoPagesComponent;

class ProtoBlock extends EventBus {
  constructor({ context, rules }) {
    super();
    
    this.context = context;
    this.rules = rules;
    
    return this.buildElement();
  }
  // state - json
  // mount
  // replaceEvents
  
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
    return fragment;
  }
  
  //traverseElement
  //injectEventHandlers
  
  swapElements() {
    
    //this.fire('mounted');
  }

  render() {}
}

PP.ProtoBlock = ProtoBlock;

export { ProtoPagesComponent, ProtoBlock };