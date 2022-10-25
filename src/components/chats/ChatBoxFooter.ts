import {Block} from '../../core/Block';
import {StoreSynced} from '../../core/Store';
import {Form} from '../forms/Form';
import {RoundButton} from '../buttons/RoundButton';
import {MessageTextarea} from '../inputs/MessageTextarea';
import {ChatBoxControl} from '../popups/ChatBoxControl';
import {sendMessageService} from '../../services/chatMessaging';

export class ChatBoxFooter extends Block {
  constructor() {
    super();
    const msgForm = new Form({
      name: 'msg',
      fieldset: ChatboxFooterChildren,
    });
    this.setProps({
      content: msgForm,
      messageTextarea: new MessageTextarea({
        name: 'message',
        placeholder: 'Сообщение...',
      }),
      sendButton: new (StoreSynced(RoundButton))({
        label: '➜',
        type: 'submit',
        style: 'chatbox__send-button',
        isLoading: true,
      }),
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

    msgForm.on(Form.EVENTS.SUBMIT_SUCCESS, sendMessageService);
  }
  render() {
    return `%{content}%`;
  }
}

const ChatboxFooterChildren = () => `
  <label class="chatbox__footer-control-wrapper">
    <input type="checkbox" 
      class="chatbox__dropdown-toggle chatbox__element_hidden">
    <a class="chatbox__attach-control chatbox__dropdown-control"></a>
    <span class="chatbox__dropdown chatbox__dropdown_bottom">
      <span class="chatbox__dropdown-menu">
        %{attachPhoto}%
        %{attachFile}%
        %{attachLocation}%
      </span>
    </span>
  </label>

  %{messageTextarea}%

  %{sendButton}%
`;
