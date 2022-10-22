import {Block} from '../../modules/Block';
import {Form} from '../forms/Form';
import {MessageTextarea} from '../inputs/MessageTextarea';
import {ChatBoxControl} from '../popups/ChatBoxControl';

export class ChatBoxFooter extends Block {
  constructor() {
    super();
    this.setProps({
      content: new Form({
        name: 'msg',
        fieldset: ChatboxFooterChildren,
      }),
      MessageTextarea,
      attachPhoto: new ChatBoxControl({
        label: 'Фото или видео',
        iconStyle: 'chatbox__icon_photo',
      }),
      attachFile: new ChatBoxControl({
        label: 'Файл',
        iconStyle: 'chatbox__icon_file',
      }),
      attachLocation: new ChatBoxControl({
        label: 'Локация',
        iconStyle: 'chatbox__icon_location',
      }),
    });
  }
  render() {
    return `%{content}%`;
  }
}

const ChatboxFooterChildren = () => `
  <label class="chatbox__footer__control__wrapper">
    <input type="checkbox" 
      class="chatbox__dropdown__toggle chatbox__element_hidden">
    <a class="chatbox__attach__control chatbox__dropdown__control"></a>
    <span class="chatbox__dropdown chatbox__dropdown_bottom">
      <span class="chatbox__dropdown__menu">
        %{attachPhoto}%
        %{attachFile}%
        %{attachLocation}%
      </span>
    </span>
  </label>

  %{ MessageTextarea({"name": "message", "placeholder": "Сообщение..."}) }%

  <button type="submit" 
    class="form__button form__button_standard form__button_round 
      chatbox__send__button">
      ➜
  </button>
`;
