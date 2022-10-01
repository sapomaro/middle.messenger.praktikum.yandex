import {ProtoBlock, EventBus} from '/src/modules/ProtoPages.js';
import {ValidationMessage} from '/src/components/forms/ValidationMessage.js';

// имя поля для повторного ввода оканчивается на 2
const repeatFieldNameSuffix = '2';

export class Input extends ProtoBlock {
  constructor(context) {
    super(context);
    const self = this;
    this.setProps({
      value: context.value || context.placeholder || '',
      onFocus: this.togglePlaceholder.bind(this),
      onBlur: this.validate.bind(this),
      onInput: function() {
        this.setAttribute('value', this.value);
        self.context.value = this.value;
      },
    });

    EventBus.on('submit', this.validate.bind(this));


    if (this.context.type === 'password' &&
        this.context.name.slice(-1) === repeatFieldNameSuffix) {
      EventBus.on('passwordChange', (password) => {
        this.context.value2 = password;
      });
    }
  }

  togglePlaceholder(event) {
    if (this.context.placeholder && event.type && event.target) {
      if (event.type === 'blur' && event.target.value === '') {
        event.target.value = this.context.placeholder;
      } else if (event.type === 'focus' &&
                 event.target.value === this.context.placeholder) {
        event.target.value = '';
      }
    }
  }

  validate(event, state) {
    if (this.context.type === 'password' &&
        this.context.name.slice(-1) !== repeatFieldNameSuffix) {
      EventBus.fire('passwordChange', this.context.value);
    }

    const msg = ValidationMessage(this.context);
    if (msg) {
      this.setProps({error: msg});
      if (state) {
        state.errorMsgs[this.context.name] = msg;
      }
      event.preventDefault();
    } else if (this.context.error) {
      this.setProps({error: null});
    }

    this.togglePlaceholder(event);
  }
}
