import './RowInput.scss';
import {Input} from './Input';

type IncomingProps = {
  name: string;
  label: string;
  value?: string;
  type?: string;
  placeholder?: string;
  error?: string;
  readonly?: boolean;
}

export class RowInput extends Input {
  constructor(props: IncomingProps) {
    super(props);
  }
  render(props: IncomingProps): string {
    return `
      <label class="container__row">
        <span class="form__row__label">${props.label}</span>
        <span class="form__text_right">
          <input
            name="${props.name}"
            type="${props.type}"
            class="form__input__field form__input__field_right"
            value="${props.value || ''}"
            onblur="%{onBlur}%"
            onfocus="%{onFocus}%"
            oninput="%{onInput}%"
            ${ props.readonly ? 'readonly="readonly"' : '' }>
          <span class="form__input__error">${props.error || ''}</span>
        </span>
      </label>
    `;
  }
}
