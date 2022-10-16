import './Form.scss';

import {Block} from '../../modules/Block';

type IncomingProps = {
  [key: string]: unknown;
  name: string;
  action?: string;
  method?: 'GET' | 'PUT' | 'POST' | 'DELETE';
  fieldset?: () => string;
}

type EventState = Record<string, Record<string, string>>;

export class Form extends Block {
  public static EVENTS: Record<string, string> = {
    SUBMIT_SUCCESS: 'submitSuccess',
    SUBMIT_FAIL: 'submitFail',
  };
  constructor(props: IncomingProps) {
    super(props);
    this.setProps({
      onSubmit: (event: Event) => {
        event.preventDefault();
        const form = document.forms.namedItem(props.name);
        if (typeof form !== 'object' || !(form instanceof HTMLFormElement)) {
          return false;
        }
        const formData: FormData = new FormData(form);
        const data: Record<string, unknown> = {};
        for (const [key, value] of formData.entries()) {
          data[key] = value;
        }
        const state: EventState = {errorMsgs: {}};
        this.listDescendants((block: Block) => {
          block.fire('submit', event, state); // для валидации инпутов формы
        });

        if (Object.keys(state.errorMsgs).length === 0) {
          // console.log('Form successfully submitted: ');
          // console.log(data);
          this.fire(Form.EVENTS.SUBMIT_SUCCESS, data);
          this.listDescendants((block: Block) => {
            block.fire(Form.EVENTS.SUBMIT_SUCCESS, event, data);
          });
        } else {
          // console.warn('Form validation failed: ');
          // console.warn(state.errorMsgs);
          this.fire(Form.EVENTS.SUBMIT_FAIL, state.errorMsgs);
          this.listDescendants((block: Block) => {
            block.fire(Form.EVENTS.SUBMIT_FAIL, event, data);
          });
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
