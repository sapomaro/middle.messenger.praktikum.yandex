let DOMLoaded = false;

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

const EventBus = {
  listeners: {},
  listEvents: function(events: string, action: Fn) {
    events.split(/[, ]+/).forEach((eventType: string): void => {
      if (!this.listeners[eventType]) {
        this.listeners[eventType] = [];
      }
      action(eventType);
    });
  },
  on: function(events: string, callback: Fn): void {
    this.listEvents(events, (eventType: string): void => {
      this.listeners[eventType].push(callback);
      if (eventType === 'init' || eventType === 'load') {
        if (isDOMReady()) {
          callback();
          DOMLoaded = true;
        }
      }
    });
  },
  fire: function(events: string, ...args: Array<unknown>): void {
    this.listEvents(events, (eventType: string): void => {
      this.listeners[eventType].forEach((listener: Fn): void => {
        listener.apply(this, args);
      });
    });
  },
  off: function(events: string, callback: Fn): void {
    this.listEvents(events, (eventType: string): void => {
      this.listeners[eventType] = this.listeners[eventType]
          .filter((listener: Fn) => (listener !== callback));
    });
  },
  init: function(): void {
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
  },
};

/*
EventBus.listeners = {};

EventBus.listEvents = function() {
  events.split(/[, ]+/).forEach((eventType: string): void => {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = [];
    }
    action(eventType);
  });
};

EventBus.on = function(events: string, callback: Fn): void {
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

EventBus.fire = function(events: string, ...args: unknown): void {
  this.listEvents(events, (eventType: string): void => {
    this.listeners[eventType].forEach((listener: Fn): void => {
      listener(...args);
    });
  });
};

EventBus.off = function(events: string, callback: Fn): void {
  this.listEvents(events, (eventType: string): void => {
    this.listeners[eventType] = this.listeners[eventType]
        .filter((listener: Fn) => (listener !== callback));
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
*/


EventBus.init();

export {EventBus};
