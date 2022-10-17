import './FileInput.scss';

import {Input, InputPropsType} from './Input';

export class FileInput extends Input {
  constructor(props?: InputPropsType) {
    super(props || {});
  }
  render(props?: InputPropsType): string {
    return `
      <div class="container__element container__element_centered">
        <label>
          <a class="container__link container__link_underlined">
            Выбрать файл <br>на компьютере
          </a>
          <input name="avatar" type="file" accept="image/png, image/jpeg" 
            class="form__input__file">
        </label>
      </div>
    `;
  }
}
