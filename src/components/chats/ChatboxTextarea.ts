import './ChatboxTextarea.scss';

import {Input, InputPropsType} from '../forms/Input';

export class ChatboxTextarea extends Input {
  constructor(props: InputPropsType) {
    super(props);
    this.on('submit', (): void => {
      this.setProps({value: ''});
    });
  }
  render(props: InputPropsType): string {
    return `
      <textarea name="${props.name}" class="chatbox__send__textarea" rows="1"
        onblur="%{onBlur}%"
        onfocus="%{onFocus}%"
        oninput="%{onInput}%"
      >${props.value || props.placeholder || ''}</textarea>
    `;
  }
}
