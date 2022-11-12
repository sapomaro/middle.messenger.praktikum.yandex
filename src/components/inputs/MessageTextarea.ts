import './MessageTextarea.scss';

import {Input, InputPropsT} from './Input';

export class MessageTextarea extends Input {
  constructor(props: InputPropsT) {
    super(props);
    this.props.onKeydown = (event: KeyboardEvent) => {
      if (event.keyCode && event.keyCode === 13 && !event.shiftKey) {
        event.preventDefault();
        const submitEvent = new Event('submit', {
          bubbles: true,
          cancelable: true,
        });
        (event.currentTarget as HTMLTextAreaElement)
            .form?.dispatchEvent?.(submitEvent);
      }
    };
    this.on('submit', (): void => {
      this.setProps({value: ''});
      (this.getElement() as HTMLTextAreaElement)?.focus();
    });
  }
  render(props: InputPropsT): string {
    return `
      <textarea name="${props.name}" class="chatbox__send-textarea" rows="1"
        onblur="%{onBlur}%"
        onfocus="%{onFocus}%"
        oninput="%{onInput}%"
        onkeydown="%{onKeydown}%"
      >${props.value || props.placeholder || ''}</textarea>
    `;
  }
}
