import {ProtoBlock} from '/src/modules/ProtoPages.js';

import '/src/components/forms/StandardInput.scss';

export const StandardInput = (props) => `
  <div class="container__element">
    <input name="${props.name}" type="${props.type || 'text'}"
      class="form__input__field form__input__field_standard"
      value="${props.value || ''}"
      onfocus="%{onFocus}%"
      onblur="%{onBlur}%"
      oninput="this.setAttribute('value', this.value);">
    <label class="form__input__label">${props.label}</label>
    <span class="form__input__error">${props.error || ''}</span>
  </div>
`;


export class StandardInput2 extends ProtoBlock {
  constructor(data) {
    super(data);
    
    this.context = {
      ...this.context,
      onFocus: () => { alert(1); },
      onBlur: () => { alert(2); },
    };
  }

  render(props) {
    return `
      <div class="container__element">
        <input name="${props.name}" type="${props.type || 'text'}"
          class="form__input__field form__input__field_standard"
          value="${props.value || ''}"
          onfocus="%{onFocus}%"
          onblur="%{onBlur}%"
          oninput="this.setAttribute('value', this.value);">
        <label class="form__input__label">${props.label}</label>
        <span class="form__input__error">${props.error || ''}</span>
      </div>
    `;
  }
}



