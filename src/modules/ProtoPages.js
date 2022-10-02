/*
# ProtoPagesJS v0.0.3a

## Dynamic template builder for the web powered by JavaScript

https://github.com/sapomaro/ProtoPagesJS

*/

import {EventBus} from '/src/modules/ProtoPages-EventBus.js';
import {ProtoView} from '/src/modules/ProtoPages-View.js';
import {ProtoBlock} from '/src/modules/ProtoPages-Component.js';
import {JSONWrapper} from '/src/modules/ProtoPages-Utils.js';

const ProtoPages = {
  ...EventBus,
  JSON: JSONWrapper,
};

EventBus.init();

export {ProtoPages, EventBus, ProtoView, ProtoBlock};
