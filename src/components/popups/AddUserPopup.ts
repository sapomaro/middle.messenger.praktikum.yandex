import {Popup} from './Popup';
import {Form} from '../forms/Form';
import {FormSet} from '../forms/FormSet';
import {addUserToChatService} from '../../services/chatChannels';

export class AddUserPopup extends Popup {
  constructor() {
    super({id: 'AddUserPopup'});
    const addUserForm = new FormSet({
      name: 'addUser',
      header: 'Добавить пользователя',
      submitLabel: 'Добавить',
      inputs: '%{ Input({"name": "login", "label": "Логин"}) }%',
    });
    this.setPropsWithoutRerender({popupContent: addUserForm});
    addUserForm.on(Form.EVENTS.SUBMIT_SUCCESS, addUserToChatService);
  }
}
