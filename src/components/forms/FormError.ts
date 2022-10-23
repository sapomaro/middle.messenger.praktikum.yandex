import {Block} from '../../modules/Block';
import {sanitizeAll} from '../../services/sanitizer';

type IncomingProps = {
  currentError: string | null;
}

export class FormError extends Block {
  constructor(props: IncomingProps) {
    super(props);
  }
  render(props: IncomingProps) {
    props = sanitizeAll(props);
    return `
      <div class="container__element container__element_centered
          container__element_adjacent">
        <span class="form__input__error">${props.currentError ?? ''}</span>
      </div>
    `;
  }
}
