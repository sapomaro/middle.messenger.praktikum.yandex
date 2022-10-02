import {ProtoBlock} from '/src/modules/ProtoPages.js';

import '/src/components/forms/common.scss';

export class Form extends ProtoBlock {
  constructor(data) {
    super(data);
    this.setProps({
      onSubmit: (event) => {
        event.preventDefault();

        const form = document.forms[this.context.name];
        const formData = new FormData(form);
        const data = {};
        for (const [key, value] of formData.entries()) {
          data[key] = value;
        }

        const state = {errorMsgs: {}};
        this.listDescendants((block) => {
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

  render(props) {
    return `
      <form name="${props.name}" class="form"
        action="${props.action || ''}"
        onsubmit="%{onSubmit}%">
          %{fieldset}%
      </form>
    `;
  }
}
