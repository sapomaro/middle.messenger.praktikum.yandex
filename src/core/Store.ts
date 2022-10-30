import {EventBus} from './EventBus';
import {objIntersect} from './Utils';
import type {Block} from './Block';
import type {StateT} from '../constants/types';

enum StoreEvents {
  UPDATE = 'updated',
}

class StoreService extends EventBus.Model {
  static __instance: StoreService;
  public EVENTS = StoreEvents;
  public state: Required<StateT> = {
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
      this.emit('init');
    });
    EventBus.on('load', () => {
      this.emit('load');
    });
  }

  setState(newState: StateT) {
    if (!objIntersect(this.state, newState)) {
      Object.assign(this.state, newState);
      this.emit(this.EVENTS.UPDATE, newState);
    }
  }

  getState() {
    return this.state;
  }
}

const Store = new StoreService();

function StoreSynced(CustomBlock: typeof Block) {
  return class extends CustomBlock {
    public ignoreSyncProps: Array<keyof StateT> = [];
    constructor(props?: StateT) {
      super({...props, ...Store.getState()});
      Store.on(Store.EVENTS.UPDATE, (newState: StateT) => {
        const newStateCopy = {...newState};
        if (this.ignoreSyncProps.length > 0) {
          this.ignoreSyncProps.forEach((key) => {
            delete newStateCopy[key];
          });
        }
        this.setProps(newStateCopy);
      });
    }
    ignoreSync(props: Array<keyof StateT>) {
      this.ignoreSyncProps = props;
    }
  };
}

export {Store, StoreSynced};
