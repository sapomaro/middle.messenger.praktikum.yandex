import './Avatar.scss';

import {Popup} from '../Popup';
import {Form} from '../forms/Form';
import {StandardButton as Button} from '../forms/StandardButton';

export class AvatarPopup extends Popup {
  constructor() {
    super();
    this.setProps({
      Button,
      popupContent: new Form({
        name: 'avatar',
        fieldset: () => `
          <h1 class="container__header">Загрузите файл</h1>
          <br>
          <div class="container__element container__element_centered">
            <label>
              <a class="container__link container__link_underlined">
                Выбрать файл <br>на компьютере
              </a>
              <input name="avatar" type="file" accept="image/png, image/jpeg" 
                class="form__input__file">
            </label>
          </div>
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
