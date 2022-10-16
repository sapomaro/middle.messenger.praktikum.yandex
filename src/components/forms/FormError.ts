import {Block} from '../../modules/Block';

export class FormError extends Block {
  constructor() {
    super();
  }
  render(props: IncomingProps): string {
    return `
      <div class="container__element container__element_centered">
        <span class="form__input__error">Error</span>
      </div>
    `;
  }
}
