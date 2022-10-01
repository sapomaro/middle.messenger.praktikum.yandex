import {ProtoBlock, EventBus} from '/src/modules/ProtoPages.js';
import {ValidationMessage} from '/src/components/forms/ValidationMessage.js';

export class Input extends ProtoBlock {
  constructor(context) {
    super(context);
    const self = this;
    this.setProps({
      value: context.value || '',
      onBlur: this.validate.bind(this),
      onInput: function() {
        this.setAttribute('value', this.value);
        self.context.value = this.value;
      },
    });

    EventBus.on('submit', this.validate.bind(this));
  }

  validate(event, state) {
    const msg = ValidationMessage(this.context);
    if (msg) {
      this.setProps({error: msg});
      if (state) {
        state.errorMsgs[this.context.name] = msg;
      }
      event.preventDefault();
      return false;
    } else if (this.context.error) {
      this.setProps({error: null});
    }
  }
}
