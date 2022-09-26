
const ProtoPagesEventBus = {};
const PP = ProtoPagesEventBus;

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

PP.listeners = {};
PP.listEvents = function(events, action) {
  events.split(/[, ]+/).forEach(eventType => {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = [];
    }
    action(eventType);
  });
};
PP.on = function(events, callback) {
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
PP.fire = function(events, ...args) {
  this.listEvents(events, (eventType) => {
    this.listeners[eventType].forEach(listener => {
      listener(...args);
    });
  });
};
PP.off = function(events, callback) {
  this.listEvents(events, (eventType) => {
    this.listeners[eventType] = this.listeners[eventType].filter(
      listener => listener !== callback
    );
  });
}
  
PP.init = function() {
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

PP.EventBus = function() {};
PP.EventBus.prototype.listeners = {};
PP.EventBus.prototype.listEvents = PP.listEvents;
PP.EventBus.prototype.on = PP.on;
PP.EventBus.prototype.fire = PP.fire;
PP.EventBus.prototype.off = PP.off;

export {ProtoPagesEventBus};
