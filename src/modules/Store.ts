import {EventBus} from './EventBus';
import {objIntersect} from './Utils';

type State = Record<string, unknown>;

enum StoreEvents {
  UPDATE = 'updated',
}

const defaultState: State = {
  user: null,
};

class StoreService extends EventBus {
  static __instance: StoreService;
  public EVENTS = StoreEvents;
  public state: State = defaultState;

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

export {Store};
