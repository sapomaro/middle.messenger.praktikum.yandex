//import {EventBus} from './EventBus';

class StoreService {
  static __instance: StoreService;
  public data: Record<string, unknown> = {};

  constructor() {
    if (StoreService.__instance) {
      return StoreService.__instance;
    }
    StoreService.__instance = this;
  }
}

const Store = new StoreService();

export {Store};
