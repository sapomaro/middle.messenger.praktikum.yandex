/*
# ProtoPagesJS v0.0.3a

## Dynamic template builder for the web powered by JavaScript

https://github.com/sapomaro/ProtoPagesJS

*/

import {ProtoPagesTemplator} from '/src/modules/ProtoPages-Templator.js';
import {ProtoPagesEventBus, EventBus} from '/src/modules/ProtoPages-EventBus.js';
import {ProtoPagesComponent, ProtoBlock} from '/src/modules/ProtoPages-Component.js';

const ProtoPages = {
  ...ProtoPagesEventBus,
  ...ProtoPagesTemplator,
  ...ProtoPagesComponent,
};
const PP = ProtoPages;


PP.compile = (context = window) => {
  PP.on('load', () => {
    PP.compileAll(context);
    PP.fire('compiled');
  });
};

PP.init();

export {ProtoPages, EventBus, ProtoBlock};
