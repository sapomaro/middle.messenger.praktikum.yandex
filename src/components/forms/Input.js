import {ProtoBlock, EventBus} from '/src/modules/ProtoPages.js';
import {getValidationMessage} from '/src/components/forms/ValidationMessage.js';

// имя поля для повторного ввода оканчивается на 2
const repeatFieldNameSuffix = '2';

export class Input extends ProtoBlock {
  constructor(context) {
    super(context);
    const self = this;
    this.setProps({
      value: context.value || context.placeholder || '',
      onFocus: function(event) {
        if (self.context.value !== '' &&
             (!self.context.placeholder ||
              self.context.placeholder !== self.context.value)) {
          self.validate.call(self, event);
        }
        self.togglePlaceholder.call(self, event);
      },
      onBlur: function(event) {
        self.validate.call(self, event);
        self.togglePlaceholder.call(self, event);
      },
      onInput: function() {
        this.setAttribute('value', this.value);
        self.context.value = this.value;
        self.autoResize(this);
      },
    });

    this.on('submit', (event, state) => {
      this.validate.call(this, event, state);
      setTimeout(() => {
        self.togglePlaceholder.call(self, event);
      }, 10);
    });


    if (this.context.type === 'password' &&
        this.context.name.slice(-1) === repeatFieldNameSuffix) {
      EventBus.on('passwordFieldChange', (password) => {
        this.context.value2 = password;
      });
    }
  }

  togglePlaceholder(event, elem) {
    if (this.context.placeholder && event.type && event.target) {
      if (event.type === 'blur' && event.target.value === '') {
        event.target.value = this.context.placeholder;
      } else if (event.type === 'focus' &&
                 event.target.value === this.context.placeholder) {
        event.target.value = '';
      }
    }
  }

  autoResize(messageField) {
    if (!messageField.nodeName || messageField.nodeName !== 'TEXTAREA') {
      return;
    }
    const style = messageField.currentStyle ||
      window.getComputedStyle(messageField);
    const boxSizing = (style.boxSizing === 'border-box') ?
      parseInt(style.borderBottomWidth, 10) +
      parseInt(style.borderTopWidth, 10) : 0;

    messageField.style.overflowY = 'hidden';
    messageField.style.height = 'auto';
    messageField.style.height = (messageField.scrollHeight + boxSizing) + 'px';
  };

  validate(event, state) {
    if (this.context.type === 'password' &&
        this.context.name.slice(-1) !== repeatFieldNameSuffix) {
      EventBus.fire('passwordFieldChange', this.context.value);
    }

    let actualValue = '';
    if (typeof this.context.placeholder !== 'undefined' &&
        typeof this.context.value !== 'undefined' &&
        this.context.placeholder === this.context.value) {
      actualValue = '';
    } else {
      actualValue = this.context.value;
    }
    const msg = getValidationMessage({
      ...this.context,
      value: actualValue,
    });
    const norefresh = (this.context.name === 'message');
    if (msg) {
      this.setProps({error: msg}, norefresh);
      if (state) {
        state.errorMsgs[this.context.name] = msg;
      }
      event.preventDefault();
    } else if (this.context.error) {
      this.setProps({error: null}, norefresh);
    }
  }
}
