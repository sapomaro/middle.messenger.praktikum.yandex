import {Block} from '../../modules/Block';
import {Router} from '../../modules/Router';

type IncomingProps = {
  url: string;
  label?: string;
  onclick?: () => void;
}

export class Link extends Block {
  constructor(props: IncomingProps) {
    super(props);
    this.setProps({
      onclickHandler: (typeof props.onclick === 'function' ?
        props.onclick : () => { Router.navigate(props.url); }
      ),
    });
  }
  render(props: IncomingProps): string {
    return `
      <a onclick="%{onclickHandler}%">
        ${props.label}
      </a>
    `;
  }
}
