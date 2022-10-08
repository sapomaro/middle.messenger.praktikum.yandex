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
      },
    });
  }
  render(props: IncomingProps): string {
    return `
      <a onclick="%{onClick}%">${props.label}</a>
    `;
  }
}
