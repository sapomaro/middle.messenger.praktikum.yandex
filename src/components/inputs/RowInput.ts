import './RowInput.scss';
import {Input, InputPropsT} from './Input';

export class RowInput extends Input {
  constructor(props: InputPropsT) {
    super(props);
  }
  render(props: InputPropsT): string {
    return `
      <label class="container__row">
        <span class="form__row-label">${props.label}</span>
        <span class="form__text_right">
          <input
            name="${props.name}"
            type="${props.type}"
            class="form__input_field form__input_field_right"
            value="${props.value || ''}"
            ${!props.autocapitalize ? 'autocapitalize="off"' : ''}
            onblur="%{onBlur}%"
            onfocus="%{onFocus}%"
            oninput="%{onInput}%"
            ${ props.readonly ? 'readonly="readonly"' : '' }>
          <span class="form__input-error">${props.error || ''}</span>
        </span>
      </label>
    `;
  }
}
