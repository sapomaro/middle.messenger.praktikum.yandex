import {Link} from '../Link';

type IncomingProps = {
  url: string;
  label: string;
}

export class StandardLink extends Link {
  constructor(props: IncomingProps) {
    super(props);
  }
  render(props: IncomingProps): string {
    return `
      <div class="container__element container__element_centered">
        <a onclick="%{onClick}%" class="container__link">${props.label}</a>
      </div>
    `;
  }
}
