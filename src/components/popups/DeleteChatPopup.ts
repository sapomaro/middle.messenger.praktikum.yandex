import {Popup, PopupProps} from './Popup';
import {Form} from '../forms/Form';
import {FormSet} from '../forms/FormSet';
import {deleteChatService} from '../../services/chatChannels';

export class DeleteChatPopup extends Popup {
  constructor(props: PopupProps) {
    super(props);
    const deleteChatForm = new FormSet({
      name: 'deleteChat',
      header: 'Удалить чат',
      submitLabel: 'Удалить',
      submitStyle: 'form__button_danger',
    });
    this.setProps({popupContent: deleteChatForm});
    deleteChatForm.on(Form.EVENTS.SUBMIT_SUCCESS, deleteChatService);
  }
}
