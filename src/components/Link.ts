import {Block} from '../modules/Block';
import {Router} from '../modules/Router';

type IncomingProps = {
  url: string;
  label?: string;
}

export class Link extends Block {
  constructor(props: IncomingProps) {
    super(props);
    this.setProps({
      onClick: function(): void {
        Router.renderView(props.url);
      }
    });
  }
  render(props: IncomingProps): string {
    return `
      <li class="container__row container__element_centered">
        <a onclick="%{onClick}%" class="container__link">${props.label}</a>
      </li>
    `;
  }
}