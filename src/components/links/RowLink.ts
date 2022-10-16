import {Link} from './Link';

type IncomingProps = {
  url: string;
  label: string;
  style: string;
  onclick?: () => void;
}

export class RowLink extends Link {
  constructor(props: IncomingProps) {
    super(props);
  }
  render(props: IncomingProps) {
    return `
      <div class="container__row">
        <a onclick="%{onclickHandler}%"
          class="form__row__label container__link ${props.style}">
            ${props.label}
        </a>
      </div>
    `;
  }
}
