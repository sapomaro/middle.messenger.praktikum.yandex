import {Input} from '/src/components/forms/Input.js';

export class ChatboxTextarea extends Input {
  constructor(context) {
    super(context);
  }
  render(props) {
    return `
      <textarea name="${props.name}" class="chatbox__send__textarea" rows="1"
        onblur="%{onBlur}%"
        onfocus="%{onFocus}%"
        oninput="%{onInput}%">${props.value || ''}</textarea>
    `;
  }
}
