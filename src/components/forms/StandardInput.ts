import './StandardInput.scss';

import {Input, InputPropsType} from './Input';

export class StandardInput extends Input {
  constructor(props: InputPropsType) {
    super(props);
  }
  render(props: InputPropsType): string {
    return `
      <div class="container__element">
        <input name="${props.name}" type="${props.type || 'text'}"
          class="form__input__field form__input__field_standard 
            ${props.error ? ' form__input__field_error' : ''}"
          value="${props.value || ''}"
          onblur="%{onBlur}%"
          onfocus="%{onFocus}%"
          oninput="%{onInput}%">
        <label class="form__input__label">${props.label}</label>
        <span class="form__input__error">${props.error || ''}</span>
      </div>
    `;
  }
}
