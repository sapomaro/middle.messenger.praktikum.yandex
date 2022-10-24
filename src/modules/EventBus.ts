type Fn = (...args: Array<unknown>) => void;

type Listeners = Record<string, Array<Fn>>;

class EventBus {
  static isDOMLoaded = false;
  static listeners: Listeners = {};
  public listeners: Listeners = {};

  static get isDOMReady(): boolean {
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
  static listEvents(eventNames: string, action: Fn) {
    eventNames.split(/[, ]+/).forEach((eventName: string): void => {
      if (!this.listeners[eventName]) {
        this.listeners[eventName] = [];
      }
      action(eventName);
    });
  }
  listEvents = EventBus.listEvents;
  static on(eventNames: string, callback: Fn): void {
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
  on = EventBus.on;
  static emit(eventNames: string, ...args: Array<unknown>): void {
    this.listEvents(eventNames, (eventName: string): void => {
      this.listeners[eventName].forEach((listener: Fn): void => {
        listener.apply(this, args);
      });
    });
  }
  emit = EventBus.emit;
  static off(events: string, callback: Fn): void {
    this.listEvents(events, (eventName: string): void => {
      this.listeners[eventName] = this.listeners[eventName]
          .filter((listener: Fn) => (listener !== callback));
    });
  }
  off = EventBus.off;

  static load(): void {
    this.emit('init, load');
    this.isDOMLoaded = true;
  }
  static init(): void {
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

EventBus.init();

export {EventBus};
