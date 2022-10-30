import './Input.scss';

import {EventBus} from '../../core/EventBus';
import {Block} from '../../core/Block';
import {getValidationMessage} from '../../services/inputValidation';

export type InputPropsType = {
  name: string;
  label?: string;
  value?: string;
  type?: 'text' | 'password' | 'email' | 'tel'| 'file' | 'number';
  placeholder?: string;
  error?: string;
  accept?: string;
  readonly?: boolean;
}

type EventState = Record<string, Record<string, string>>;

export class Input extends Block {
  constructor(props: InputPropsType) {
    super(props);
    const self = this; /* потому что в событийных коллбэках ниже
                          this = элементу, на который они вешаются */
    this.setPropsWithoutRerender({
      value: props.value || props.placeholder || '',
      onFocus: function(event: Event): void {
        if (!this.getAttribute('readonly')) {
          // if (self.hasActualValue) {
          //  self.validate.call(self, event);
          // }
          self.togglePlaceholder.call(self, event);
          self.emit('focus', event);
        }
      },
      onBlur: function(event: Event): void {
        if (!this.getAttribute('readonly')) {
          self.validate.call(self, event);
          self.togglePlaceholder.call(self, event);
          self.emit('blur', event);
        }
      },
      onInput: function(event: Event): void {
        this.setAttribute('value', this.value); /* для правильного отображения
                                                   лейблов на инпутах */
        self.props.value = this.value;
        self.autoResize(this);
        self.emit('input', event);
      },
      onChange: function(event: Event): void {
        this.setAttribute('value', this.value);
        self.props.value = this.value;
        self.validate.call(self, event);
        self.emit('change', event);
      },
    });

    this.on('submit', (event: Event, state: EventState): void => {
      this.validate.call(this, event, state);
      setTimeout((): void => {
        self.togglePlaceholder.call(self, event);
      }, 10);
    });

    if (this.isPasswordInput && this.isRepeatInput) {
      EventBus.on('passwordFieldChange', (password: string) => {
        this.props.value2 = password;
      });
    }
  }

  get hasActualValue() {
    const {value, placeholder} = this.props;
    const valueNotEmpty = (value && value !== '');
    const valueNotPlaceholder = (!placeholder || placeholder !== value);
    if (valueNotEmpty && valueNotPlaceholder) {
      return true;
    }
    return false;
  }

  get isPasswordInput() {
    return (this.props.type && this.props.type === 'password');
  }
  get isRepeatInput() {
    // имя поля для повторного ввода оканчивается на 2
    const repeatFieldNameSuffix = '2';
    return (typeof this.props.name === 'string' &&
      this.props.name.slice(-1) === repeatFieldNameSuffix);
  }

  validate(event: Event, state: EventState) {
    if (this.isPasswordInput && !this.isRepeatInput) {
      EventBus.emit('passwordFieldChange', this.props.value);
    }
    let actualValue = '';
    if (this.hasActualValue && typeof this.props.value === 'string') {
      actualValue = this.props.value;
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

  autoResize(textarea: HTMLTextAreaElement) {
    if (!textarea.nodeName || textarea.nodeName !== 'TEXTAREA') {
      return;
    }
    const style = window.getComputedStyle(textarea);
    const boxSizing: number = (style.boxSizing === 'border-box') ?
      parseInt(style.borderBottomWidth, 10) +
      parseInt(style.borderTopWidth, 10) : 0;

    textarea.style.overflowY = 'hidden';
    textarea.style.height = 'auto';
    textarea.style.height = (textarea.scrollHeight + boxSizing) + 'px';
  }
}
