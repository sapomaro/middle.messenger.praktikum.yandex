import {Link} from './Link';

type IncomingProps = {
  url: string;
  label?: string;
}

export class RoundButtonLink extends Link {
  constructor(props: IncomingProps) {
    super(props);
  }
  render(): string {
    return `
      <button onclick="%{onClick}%" 
        class="form__button form__button_standard form__button_round">
          ⬅
      </button>
    `;
  }
}
