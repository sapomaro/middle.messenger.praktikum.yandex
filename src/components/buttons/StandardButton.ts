import './StandardButton.scss';

import {Block} from '../../modules/Block';

type IncomingProps = {
  name: string;
  label: string;
  type?: 'submit' | 'button';
  error?: string;
  style?: string;
  isLoading?: boolean;
  onclick?: () => void;
}

export class StandardButton extends Block {
  constructor(props: IncomingProps) {
    super(props);
    if (!props.onclick) {
      this.props.onclick = () => null;
    }
  }
  render(props: IncomingProps) {
    return `
      <div class="container__element container__element_centered">
        <button name="${props.name}"
          type="${props.type || 'button'}"
          class="form__button form__button_standard ${props.style || ''}"
          onclick="%{onclick}%"
          ${props.isLoading? 'disabled="disabled"' : ''}>
            ${props.isLoading? 'Запрос обрабатывается...' : props.label}
        </button>
        <span class="form__input__error">${props.error || ''}</span>
      </div>
    `;
  }
}
