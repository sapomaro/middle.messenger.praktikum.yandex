import {Input} from '/src/components/forms/Input.js';

import '/src/components/forms/StandardInput.scss';

export class StandardInput extends Input {
  constructor(context) {
    super(context);
  }

  render(props) {
    return `
      <div class="container__element">
        <input name="${props.name}" type="${props.type || 'text'}"
          class="form__input__field form__input__field_standard"
          value="${props.value || ''}"
          onblur="%{onBlur}%"
          oninput="%{onInput}%">
        <label class="form__input__label">${props.label}</label>
        <span class="form__input__error">${props.error || ''}</span>
      </div>
    `;
  }
}
