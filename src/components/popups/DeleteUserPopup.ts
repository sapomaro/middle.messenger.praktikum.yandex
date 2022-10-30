import {Popup} from './Popup';
import {Form} from '../forms/Form';
import {FormSet} from '../forms/FormSet';
import {deleteUserFromChatService} from '../../services/chatChannels';

export class DeleteUserPopup extends Popup {
  constructor() {
    super({id: 'DeleteUserPopup'});
    const deleteUserForm = new FormSet({
      name: 'deleteUser',
      header: 'Удалить пользователя из чата',
      submitLabel: 'Удалить',
      inputs: '%{ Input({"name": "login", "label": "Логин"}) }%',
    });
    this.setPropsWithoutRerender({popupContent: deleteUserForm});
    deleteUserForm.on(Form.EVENTS.SUBMIT_SUCCESS, deleteUserFromChatService);
  }
}
