import {ProtoPagesEventBus} from '/src/modules/ProtoPages-EventBus.js';

const ProtoPagesComponent = {...ProtoPagesEventBus};
const PP = ProtoPagesComponent;

class ProtoBlock extends PP.EventBus {
  constructor({ template, context, rules }) {
    this.template = template;
    this.context = context;
    this.rules = rules;
  }
  // state - json
  // mount
  // replaceEvents
  
  buildElement() {
    this.elementHolder = document.createElement('DIV');
    let htmlCode = '';
    if (this.rules.unwrap && this.context instanceof Array) {
      for (const item of this.context) {
        htmlCode += this.template(item);
      }
    } else {
      htmlCode = this.template(this.context);
    }
    this.elementHolder.innerHTML = htmlCode;
  }
  
  //traverseElement
  //injectEventHandlers
  
  swapElements() {
    
    //this.fire('mounted');
  }

  //render() {}
}

PP.ProtoBlock = ProtoBlock;

export {ProtoPagesComponent};