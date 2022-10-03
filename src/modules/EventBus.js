let DOMLoaded = false;

const isDOMReady = () => {
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

const EventBus = function() {};

EventBus.listeners = {};

EventBus.listEvents = function(events, action) {
  events.split(/[, ]+/).forEach((eventType) => {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = [];
    }
    action(eventType);
  });
};

EventBus.on = function(events, callback) {
  this.listEvents(events, (eventType) => {
    this.listeners[eventType].push(callback);
    if (eventType === 'init' || eventType === 'load') {
      if (isDOMReady()) {
        callback();
        DOMLoaded = true;
      }
    }
  });
};

EventBus.fire = function(events, ...args) {
  this.listEvents(events, (eventType) => {
    this.listeners[eventType].forEach((listener) => {
      listener(...args);
    });
  });
};

EventBus.off = function(events, callback) {
  this.listEvents(events, (eventType) => {
    this.listeners[eventType] = this.listeners[eventType]
        .filter((listener) => (listener !== callback));
  });
};

EventBus.init = function() {
  if (isDOMReady()) {
    this.fire('init, load');
    DOMLoaded = true;
  } else {
    window.addEventListener('DOMContentLoaded', () => {
      if (isDOMReady()) {
        this.fire('init, load');
        DOMLoaded = true;
      }
    });
    window.addEventListener('load', () => {
      if (!DOMLoaded) {
        this.fire('init, load');
        DOMLoaded = true;
      }
    });
  }
};

EventBus.prototype = {
  ...EventBus,
  listeners: {},
};

EventBus.init();

export {EventBus};
