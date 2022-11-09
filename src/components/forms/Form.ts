import './Form.scss';

import {Block} from '../../core/Block';
import {Store} from '../../core/Store';

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
    this.props.onSubmit = (event: Event) => {
      event.preventDefault();
      if (Store.state.isLoading) {
        return false;
      }
      const form = document.forms.namedItem(props.name);
      if (!(form instanceof HTMLFormElement)) {
        return false;
      }
      const formData: FormData = new FormData(form);
      const jsonData: Record<string, unknown> = {};
      for (const [key, value] of formData.entries()) {
        jsonData[key] = value;
      }
      const state: EventState = {errorMsgs: {}};
      this.listDescendants((block: Block) => {
        block.emit('submit', event, state); // для валидации инпутов формы
      });
      if (!Object.keys(state.errorMsgs).length) {
        this.emit(Form.EVENTS.SUBMIT_SUCCESS, jsonData, formData);
        this.listDescendants((block: Block) => {
          block.emit(Form.EVENTS.SUBMIT_SUCCESS, event, jsonData, formData);
        });
      } else {
        this.emit(Form.EVENTS.SUBMIT_FAIL, state.errorMsgs);
        this.listDescendants((block: Block) => {
          block.emit(Form.EVENTS.SUBMIT_FAIL, event, state.errorMsgs);
        });
      }
      return false;
    };
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
