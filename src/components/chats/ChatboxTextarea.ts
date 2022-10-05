import './ChatboxTextarea.scss';

import {Input} from '../forms/Input';

type IncomingProps = {
  name: string;
  label?: string;
  value?: string;
  placeholder?: string;
}

export class ChatboxTextarea extends Input {
  constructor(props: IncomingProps) {
    super(props);
    this.on('submit', (): void => {
      this.setProps({value: ''});
    });
  }
  render(props: IncomingProps): string {
    return `
      <textarea name="${props.name}" class="chatbox__send__textarea" rows="1"
        onblur="%{onBlur}%"
        onfocus="%{onFocus}%"
        oninput="%{onInput}%"
      >${props.value || props.placeholder || ''}</textarea>
    `;
  }
}
