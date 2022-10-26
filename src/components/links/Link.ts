import './Link.scss';

import {Block} from '../../core/Block';
import {Router} from '../../core/Router';

export type LinkProps = {
  url?: string;
  label?: string;
  style?: string;
  type?: string;
  isLoading?: boolean;
  onclick?: () => void;
}

export class Link extends Block {
  constructor(props: LinkProps) {
    super(props);
    this.setProps({
      onclickHandler: ((typeof props.onclick === 'function') ?
        props.onclick :
        () => {
          if (typeof props.url === 'string') {
            Router.navigate(props.url);
          }
        }
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
