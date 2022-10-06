let DOMLoaded: boolean = false;

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

const EventBus = function(): void {};

EventBus.listeners = {};

EventBus.listEvents = function(events: string, action: Function): void {
  events.split(/[, ]+/).forEach((eventType: string): void => {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = [];
    }
    action(eventType);
  });
};

EventBus.on = function(events: string, callback: Function): void {
  this.listEvents(events, (eventType: string): void => {
    this.listeners[eventType].push(callback);
    if (eventType === 'init' || eventType === 'load') {
      if (isDOMReady()) {
        callback();
        DOMLoaded = true;
      }
    }
  });
};

EventBus.fire = function(events: string, ...args: any): void {
  this.listEvents(events, (eventType: string): void => {
    this.listeners[eventType].forEach((listener: Function): void => {
      listener(...args);
    });
  });
};

EventBus.off = function(events: string, callback: Function): void {
  this.listEvents(events, (eventType: string): void => {
    this.listeners[eventType] = this.listeners[eventType]
        .filter((listener: Function) => (listener !== callback));
  });
};

EventBus.init = function(): void {
  if (isDOMReady()) {
    this.fire('init, load');
    DOMLoaded = true;
  } else {
    window.addEventListener('DOMContentLoaded', (): void => {
      if (isDOMReady()) {
        this.fire('init, load');
        DOMLoaded = true;
      }
    });
    window.addEventListener('load', (): void => {
      if (!DOMLoaded) {
        this.fire('init, load');
        DOMLoaded = true;
      }
    });
  }
};

/*
EventBus.prototype = {
  ...EventBus,
  listeners: {},
};*/

EventBus.init();

export {EventBus};
