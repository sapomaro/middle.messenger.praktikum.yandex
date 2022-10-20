import './RoundButton.scss';

import {Link} from '../links/Link';

type IncomingProps = {
  url: string;
  label?: string;
}

export class RoundButton extends Link {
  constructor(props: IncomingProps) {
    super(props);
  }
  render(): string {
    return `
      <button onclick="%{onclickHandler}%" 
        class="form__button form__button_standard form__button_round">
          ⬅
      </button>
    `;
  }
}
