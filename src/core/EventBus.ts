type Fn = (...args: Array<unknown>) => void;

class EventBusService {
  static __instance: EventBusService;
  public Model: typeof EventBusService;
  public isDOMLoaded = false;
  public listeners: Record<string, Array<Fn>> = {};

  listEvents(eventNames: string, action: Fn) {
    eventNames.split(/[, ]+/).forEach((eventName: string): void => {
      if (!this.listeners[eventName]) {
        this.listeners[eventName] = [];
      }
      action(eventName);
    });
  }

  on(eventNames: string, callback: Fn): void {
    this.listEvents(eventNames, (eventName: string): void => {
      this.listeners[eventName].push(callback);
      if (eventName === 'init' || eventName === 'load') {
        if (EventBus.isDOMReady) {
          callback();
          EventBus.isDOMLoaded = true;
        }
      }
    });
  }

  emit(eventNames: string, ...args: Array<unknown>): void {
    this.listEvents(eventNames, (eventName: string): void => {
      this.listeners[eventName].forEach((listener: Fn): void => {
        listener.apply(this, args);
      });
    });
  }

  off(events: string, callback: Fn): void {
    this.listEvents(events, (eventName: string): void => {
      this.listeners[eventName] = this.listeners[eventName]
          .filter((listener: Fn) => (listener !== callback));
    });
  }

  get isDOMReady(): boolean {
    if (document.readyState === 'interactive' &&
        typeof document.body !== 'undefined' &&
        typeof document.head !== 'undefined') {
      return true;
    } else if (document.readyState === 'complete') {
      return true;
    } else {
      return false;
    }
  }

  load(): void {
    this.emit('init, load');
    this.isDOMLoaded = true;
  }

  init(): void {
    if (this.isDOMReady) {
      this.load();
    } else {
      window.addEventListener('DOMContentLoaded', (): void => {
        if (this.isDOMReady) {
          this.load();
        }
      });
      window.addEventListener('load', (): void => {
        if (!this.isDOMLoaded) {
          this.load();
        }
      });
    }
  }
}

const EventBus = new EventBusService();

EventBus.init();

EventBus.Model = EventBusService;

export {EventBus};
