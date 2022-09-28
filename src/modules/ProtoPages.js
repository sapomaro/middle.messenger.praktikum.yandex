/*
# ProtoPagesJS v0.0.3a

## Dynamic template builder for the web powered by JavaScript

https://github.com/sapomaro/ProtoPagesJS

*/

import {ProtoPagesTemplator} from '/src/modules/ProtoPages-Templator.js';
import {ProtoPagesEventBus} from '/src/modules/ProtoPages-EventBus.js';
import {ProtoPagesComponent} from '/src/modules/ProtoPages-Component.js';

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

const EventBus = PP.EventBus;
const ProtoBlock = PP.ProtoBlock;

export { ProtoPages, EventBus, ProtoBlock };
