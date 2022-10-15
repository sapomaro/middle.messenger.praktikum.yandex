import {Popup} from './Popup';
import {Form} from '../forms/Form';
import {StandardInput as Input} from '../inputs/StandardInput';
import {StandardButton as Button} from '../buttons/StandardButton';

export class AddUserPopup extends Popup {
  constructor() {
    super();
    this.setProps({
      Input,
      Button,
      popupContent: new Form({
        name: 'addUser',
        fieldset: () => `
          <h1 class="container__header">Добавить пользователя</h1>
          <br>
          %{ Input({"name": "user", "label": "Логин"}) }%
          <br>
          %{ Button({"name": "add", "type": "submit", "label": "Добавить"}) }%
        `,
      }),
    });
  }
}
