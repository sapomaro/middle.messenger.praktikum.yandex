import {Popup} from './Popup';
import {Form} from '../forms/Form';
import {StandardButton as Button} from '../buttons/StandardButton';
import {FileInput} from '../inputs/FileInput';

export class AvatarPopup extends Popup {
  constructor() {
    super();
    this.setProps({
      Button, FileInput,
      popupContent: new Form({
        name: 'avatar',
        fieldset: () => `
          <h1 class="container__header">Загрузите файл</h1>
          <br>
          %{FileInput}%
          <br>
          %{ Button({ 
            "name": "submit", "type": "button", "label": "Поменять",
            "error": "Нужно выбрать файл"
          }) }%
        `,
      }),
    });
  }
}
