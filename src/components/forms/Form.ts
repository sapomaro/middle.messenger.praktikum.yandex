import './common.scss';

import {Block} from '../../modules/Block';

type IncomingProps = {
  name: string;
  action?: string;
  fieldset?: () => string;
}

export class Form extends Block {
  constructor(props: IncomingProps) {
    super(props);
    this.setProps({
      onSubmit: (event: Event) => {
        event.preventDefault();

        const form: HTMLFormElement = document.forms[this.props.name];
        const formData: FormData = new FormData(form);
        const data: Record<string, any> = {};
        for (const [key, value] of formData.entries()) {
          data[key] = value;
        }

        const state: Record<string, any> = {errorMsgs: {}};
        this.listDescendants((block: Block) => {
          block.fire('submit', event, state);
        });

        if (Object.keys(state.errorMsgs).length === 0) {
          console.log('Form successfully submitted: ');
          console.log(data);
        } else {
          console.warn('Form validation failed: ');
          console.warn(state.errorMsgs);
        }
        return false;
      },
    });
  }
  render(props: IncomingProps): string {
    return `
      <form name="${props.name}" class="form"
        action="${props.action || ''}"
        onsubmit="%{onSubmit}%">
          %{fieldset}%
      </form>
    `;
  }
}
