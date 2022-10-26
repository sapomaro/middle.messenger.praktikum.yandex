import {Input, InputPropsType} from './Input';

import './StandardInput.scss';

export class StandardInput extends Input {
  constructor(props: InputPropsType) {
    super(props);
  }
  render(props: InputPropsType): string {
    return `
      <div class="container__element">
        <input name="${props.name}" type="${props.type || 'text'}"
          class="form__input_field form__input_field_standard 
            ${props.error ? ' form__input_field_error' : ''}"
          value="${props.value || ''}"
          onblur="%{onBlur}%"
          onfocus="%{onFocus}%"
          oninput="%{onInput}%">
        <label class="form__input-label">${props.label}</label>
        <span class="form__input-error">${props.error || ''}</span>
      </div>
    `;
  }
}
