import {Link} from '../Link';

type IncomingProps = {
  url: string;
  label: string;
  style: string;
}

export class RowLink extends Link {
  constructor(props: IncomingProps) {
    super(props);
  }
  render(props: IncomingProps): string {
    return `
      <div class="container__row">
        <a onclick="%{onClick}%"
          class="form__row__label container__link ${props.style}">
            ${props.label}
        </a>
      </div>
    `;
  }
}
