import {EventBus} from '../../modules/EventBus';
import {Block} from '../../modules/Block';
import {getValidationMessage} from './ValidationMessage';

// имя поля для повторного ввода оканчивается на 2
const repeatFieldNameSuffix = '2';

export type InputPropsType = {
  name: string;
  label?: string;
  value?: string;
  type?: 'text' | 'password' | 'email' | 'tel' | 'number';
  placeholder?: string;
  error?: string;
  readonly?: boolean;
}

type EventState = Record<string, Record<string, string>>;

export class Input extends Block {
  constructor(props: InputPropsType) {
    super(props);
    const self = this; // в событийных коллбэках ниже this = элементу, 
                       // на который они вешаются
    this.setProps({
      value: props.value || props.placeholder || '',
      onFocus: function(event: Event): void {
        const {value, placeholder} = self.props;
        const valueNotEmpty = (value !== '');
        const valueNotPlaceholder = (!placeholder || placeholder !== value);
        if (valueNotEmpty && valueNotPlaceholder) {
          self.validate.call(self, event);
        }
        self.togglePlaceholder.call(self, event);
      },
      onBlur: function(event: Event): void {
        self.validate.call(self, event);
        self.togglePlaceholder.call(self, event);
      },
      onInput: function(): void {
        this.setAttribute('value', this.value);
        self.props.value = this.value;
        self.autoResize(this);
      },
    });

    this.on('submit', (event: Event, state: EventState): void => {
      this.validate.call(this, event, state);
      setTimeout((): void => {
        self.togglePlaceholder.call(self, event);
      }, 10);
    });

    const isPswdInput = (props.type === 'password');
    const isRepeatPswdInput = (props.name.slice(-1) === repeatFieldNameSuffix);
    if (isPswdInput && isRepeatPswdInput) {
      EventBus.on('passwordFieldChange', (password: string) => {
        this.props.value2 = password;
      });
    }
  }

  togglePlaceholder(event: Event) {
    if (typeof this.props.placeholder === 'string' &&
        event.type && event.target) {
      const target = event.target as HTMLInputElement | HTMLTextAreaElement;
      if (event.type === 'blur' && target.value === '') {
        target.value = this.props.placeholder;
      } else if (event.type === 'focus' &&
                 target.value === this.props.placeholder) {
        target.value = '';
      }
    }
  }

  autoResize(messageField: HTMLTextAreaElement) {
    if (!messageField.nodeName || messageField.nodeName !== 'TEXTAREA') {
      return;
    }
    const style = window.getComputedStyle(messageField);
    const boxSizing: number = (style.boxSizing === 'border-box') ?
      parseInt(style.borderBottomWidth, 10) +
      parseInt(style.borderTopWidth, 10) : 0;

    messageField.style.overflowY = 'hidden';
    messageField.style.height = 'auto';
    messageField.style.height = (messageField.scrollHeight + boxSizing) + 'px';
  }

  validate(event: Event, state: EventState) {
    if (this.props.type === 'password' &&
        typeof this.props.name === 'string' &&
        this.props.name.slice(-1) !== repeatFieldNameSuffix) {
      EventBus.fire('passwordFieldChange', this.props.value);
    }
    let actualValue = '';
    if (typeof this.props.value === 'string') {
      if (typeof this.props.placeholder !== 'undefined' &&
          this.props.placeholder === this.props.value) {
        actualValue = '';
      } else {
        actualValue = this.props.value;
      }
    }
    const msg: string | null = getValidationMessage({
      ...this.props,
      value: actualValue,
    });
    if (msg && typeof this.props.name === 'string') {
      this.setProps({error: msg});
      if (state && typeof state.errorMsgs === 'object' &&
          state.errorMsgs !== null) {
        state.errorMsgs[this.props.name] = msg;
      }
      event.preventDefault();
    } else if (this.props.error) {
      this.setProps({error: null});
    }
  }
}
