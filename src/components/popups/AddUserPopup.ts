import {Popup, PopupProps} from './Popup';
import {Form} from '../forms/Form';
import {FormSet} from '../forms/FormSet';
import {addUserToChatService} from '../../services/chats';

export class AddUserPopup extends Popup {
  constructor(props: PopupProps) {
    super(props);
    const addUserForm = new FormSet({
      name: 'addUser',
      header: 'Добавить пользователя',
      submitLabel: 'Добавить',
      inputs: '%{ Input({"name": "login", "label": "Логин"}) }%',
    });
    this.setProps({popupContent: addUserForm});
    addUserForm.on(Form.EVENTS.SUBMIT_SUCCESS, (data: {login: string}) => {
      addUserToChatService(data);
    });
  }
}
