import {EventBus} from './EventBus';
import {objIntersect} from './Utils';
import type {Block} from './Block';

type State = {
  [key: string]: unknown;
  /*user: null,
  chats: Array<unknown>;
  activeChatId: number;
  activeChatToken: string;
  activeChatMessages: Array<unknown>;
  isLoading: boolean;*/
};

enum StoreEvents {
  UPDATE = 'updated',
}

class StoreService extends EventBus {
  static __instance: StoreService;
  public EVENTS = StoreEvents;
  public state: State = {
    user: null,
    chats: [],
    activeChatId: 0,
    activeChatToken: '',
    activeChatMessages: [],
    isLoading: false,
  };

  constructor() {
    super();
    if (StoreService.__instance) {
      return StoreService.__instance;
    }
    StoreService.__instance = this;
    EventBus.on('init', () => {
      this.fire('init');
    });
    EventBus.on('load', () => {
      this.fire('load');
    });
  }

  setState(newState: State) {
    if (!objIntersect(this.state, newState)) {
      Object.assign(this.state, newState);
      this.fire(this.EVENTS.UPDATE, newState);
    }
  }

  getState() {
    return this.state;
  }
}

const Store = new StoreService();

const StoreSynced = (CustomBlock: typeof Block) => {
  return class extends CustomBlock {
    constructor(props?: State) {
      super({...props, ...Store.getState()});
      Store.on(Store.EVENTS.UPDATE, (newState: State) => {
        this.setProps(newState);
      });
    }
  } 
};

export {Store, StoreSynced};
