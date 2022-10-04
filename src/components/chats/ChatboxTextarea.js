import '/src/components/chats/ChatboxTextarea.scss';

import {Input} from '/src/components/forms/Input';

export class ChatboxTextarea extends Input {
  constructor(context) {
    super(context);
    this.on('submit', () => {
      this.setProps({value: ''});
    });
  }
  render(props) {
    return `
      <textarea name="${props.name}" class="chatbox__send__textarea" rows="1"
        onblur="%{onBlur}%"
        onfocus="%{onFocus}%"
        oninput="%{onInput}%"
      >${props.value || props.placeholder || ''}</textarea>
    `;
  }
}
