import './RoundButton.scss';

import {Link, LinkProps} from '../links/Link';

export class RoundButton extends Link {
  constructor(props: LinkProps) {
    super(props);
  }
  render(props: LinkProps) {
    return `
      <button onclick="%{onclickHandler}%" 
        ${props.type? 'type="'+props.type+'"' : '' }
        ${props.isLoading? 'disabled="disabled"' : ''}
        class="form__button form__button_standard form__button_round 
        ${props.style || ''}">
          ${props.label}
      </button>
    `;
  }
}
