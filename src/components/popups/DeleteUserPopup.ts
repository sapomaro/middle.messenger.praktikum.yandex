import {Popup, PopupProps} from './Popup';
import {Form} from '../forms/Form';
import {FormSet} from '../forms/FormSet';
import {deleteUserFromChatService} from '../../services/chats';

export class DeleteUserPopup extends Popup {
  constructor(props: PopupProps) {
    super(props);
    const deleteUserForm = new FormSet({
      name: 'deleteUser',
      header: 'Удалить пользователя из чата',
      submitLabel: 'Удалить',
      inputs: '%{ Input({"name": "login", "label": "Логин"}) }%',
    });
    this.setProps({popupContent: deleteUserForm});
    deleteUserForm.on(Form.EVENTS.SUBMIT_SUCCESS, (data: {login: string}) => {
      deleteUserFromChatService(data);
    });
  }
}
