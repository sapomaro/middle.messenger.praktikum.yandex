import {Block} from '../../modules/Block';

type IncomingProps = {
  currentFormError: string | null;
}

export class FormError extends Block {
  constructor(props: IncomingProps) {
    super(props);
  }
  render(props: IncomingProps) {
    return `
      <div class="container__element container__element_centered
          container__element_adjacent">
        <span class="form__input__error">${props.currentFormError ?? ''}</span>
      </div>
    `;
  }
}
