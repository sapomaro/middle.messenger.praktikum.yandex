import {Block} from '../../modules/Block';
import {StoreSynced} from '../../modules/Store';
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
        style: 'chatbox__send__button',
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

    msgForm.on(Form.EVENTS.SUBMIT_SUCCESS, (data: {message: string}) => {
      sendMessageService(data);
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

  %{messageTextarea}%

  %{sendButton}%
`;
