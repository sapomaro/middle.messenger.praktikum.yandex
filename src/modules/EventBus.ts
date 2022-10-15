let isDOMLoaded = false;

const isDOMReady = (): boolean => {
  if (document.readyState === 'interactive' &&
      typeof document.body !== 'undefined' &&
      typeof document.head !== 'undefined') {
    return true;
  } else if (document.readyState === 'complete') {
    return true;
  } else {
    return false;
  }
};

type Fn = (...args: Array<unknown>) => void;

type Listeners = Record<string, Array<Fn>>;

class EventBus {
  static listeners: Listeners = {};
  public listeners: Listeners = {};
  constructor() {}
  static listEvents(events: string, action: Fn) {
    events.split(/[, ]+/).forEach((eventType: string): void => {
      if (!this.listeners[eventType]) {
        this.listeners[eventType] = [];
      }
      action(eventType);
    });
  }
  listEvents = EventBus.listEvents;
  static on(events: string, callback: Fn): void {
    this.listEvents(events, (eventType: string): void => {
      this.listeners[eventType].push(callback);
      if (eventType === 'init' || eventType === 'load') {
        if (isDOMReady()) {
          callback();
          isDOMLoaded = true;
        }
      }
    });
  }
  on = EventBus.on;
  static fire(events: string, ...args: Array<unknown>): void {
    this.listEvents(events, (eventType: string): void => {
      this.listeners[eventType].forEach((listener: Fn): void => {
        listener.apply(this, args);
      });
    });
  }
  fire = EventBus.fire;
  static off(events: string, callback: Fn): void {
    this.listEvents(events, (eventType: string): void => {
      this.listeners[eventType] = this.listeners[eventType]
          .filter((listener: Fn) => (listener !== callback));
    });
  }
  off = EventBus.off;
  static init(): void {
    if (isDOMReady()) {
      this.fire('init, load');
      isDOMLoaded = true;
    } else {
      window.addEventListener('DOMContentLoaded', (): void => {
        if (isDOMReady()) {
          this.fire('init, load');
          isDOMLoaded = true;
        }
      });
      window.addEventListener('load', (): void => {
        if (!isDOMLoaded) {
          this.fire('init, load');
          isDOMLoaded = true;
        }
      });
    }
  }
}

EventBus.init();

export {EventBus};
