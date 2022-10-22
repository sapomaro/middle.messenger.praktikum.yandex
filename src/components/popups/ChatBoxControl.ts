import {PopupControl} from './PopupControl';

type ChatBoxControlProps = {
  label: string;
  iconStyle: string;
  iconText?: string;
  forId?: string;
};

export class ChatBoxControl extends PopupControl {
  constructor(props: ChatBoxControlProps) {
    super(props);
  }
  render(props: ChatBoxControlProps) {
    return `
      <span class="chatbox__dropdown__element" onclick="%{showPopup}%">
        <span class="chatbox__icon ${props.iconStyle}">
          ${props.iconText? props.iconText : ''}
        </span>
        ${props.label}
      </span>
    `;
  }
}
