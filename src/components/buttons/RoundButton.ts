import './RoundButton.scss';

import {Link, LinkProps} from '../links/Link';

export class RoundButton extends Link {
  constructor(props: LinkProps) {
    super(props);
  }
  render(props: LinkProps) {
    return `
      <button onclick="%{onclickHandler}%" 
        class="form__button form__button_standard form__button_round">
          ${props.label}
      </button>
    `;
  }
}
