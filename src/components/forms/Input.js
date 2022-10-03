import {EventBus} from '/src/modules/EventBus.js';
import {Block} from '/src/modules/Block.js';
import {getValidationMessage} from '/src/components/forms/ValidationMessage.js';

// имя поля для повторного ввода оканчивается на 2
const repeatFieldNameSuffix = '2';

export class Input extends Block {
  constructor(props) {
    super(props);
    const self = this;
    this.setProps({
      value: props.value || props.placeholder || '',
      onFocus: function(event) {
        if (self.props.value !== '' &&
             (!self.props.placeholder ||
              self.props.placeholder !== self.props.value)) {
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
        self.props.value = this.value;
        self.autoResize(this);
      },
    });

    this.on('submit', (event, state) => {
      this.validate.call(this, event, state);
      setTimeout(() => {
        self.togglePlaceholder.call(self, event);
      }, 10);
    });


    if (this.props.type === 'password' &&
        this.props.name.slice(-1) === repeatFieldNameSuffix) {
      EventBus.on('passwordFieldChange', (password) => {
        this.props.value2 = password;
      });
    }
  }

  togglePlaceholder(event, elem) {
    if (this.props.placeholder && event.type && event.target) {
      if (event.type === 'blur' && event.target.value === '') {
        event.target.value = this.props.placeholder;
      } else if (event.type === 'focus' &&
                 event.target.value === this.props.placeholder) {
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
    if (this.props.type === 'password' &&
        this.props.name.slice(-1) !== repeatFieldNameSuffix) {
      EventBus.fire('passwordFieldChange', this.props.value);
    }

    let actualValue = '';
    if (typeof this.props.placeholder !== 'undefined' &&
        typeof this.props.value !== 'undefined' &&
        this.props.placeholder === this.props.value) {
      actualValue = '';
    } else {
      actualValue = this.props.value;
    }
    const msg = getValidationMessage({
      ...this.props,
      value: actualValue,
    });
    const norefresh = (this.props.name === 'message');
    if (msg) {
      this.setProps({error: msg}, norefresh);
      if (state) {
        state.errorMsgs[this.props.name] = msg;
      }
      event.preventDefault();
    } else if (this.props.error) {
      this.setProps({error: null}, norefresh);
    }
  }
}
