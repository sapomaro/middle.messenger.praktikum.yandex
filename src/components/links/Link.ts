import './Link.scss';

import {Block} from '../../modules/Block';
import {Router} from '../../modules/Router';

export type LinkProps = {
  url?: string;
  label?: string;
  onclick?: () => void;
}

export class Link extends Block {
  constructor(props: LinkProps) {
    super(props);
    this.setProps({
      onclickHandler: ((typeof props.onclick === 'function' &&
          typeof props.url === 'string') ?
        props.onclick : () => { Router.navigate(props.url); }
      ),
    });
  }
  render(props: LinkProps): string {
    return `
      <a onclick="%{onclickHandler}%">
        ${props.label}
      </a>
    `;
  }
}
