import {Link} from './Link';

type IncomingProps = {
  url: string;
  label: string;
}

export class MenuLink extends Link {
  constructor(props: IncomingProps) {
    super(props);
  }
  render(props: IncomingProps): string {
    return `
      <li class="container__row container__element_centered">
        <a onclick="%{onClick}%" class="container__link">${props.label}</a>
      </li>
    `;
  }
}
