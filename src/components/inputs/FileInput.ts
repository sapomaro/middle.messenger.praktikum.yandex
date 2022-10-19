import './FileInput.scss';

import {Input, InputPropsType} from './Input';

export class FileInput extends Input {
  constructor(props: InputPropsType) {
    super(props);
    this.on('change', () => {
      this.fire('updated');
    });
  }
  render(props: InputPropsType): string {
    let fileName = '';
    if (props && props.value) {
      fileName = props.value.split(/[\\/]+/).pop() as string;
    }
    return `
      <div class="container__element container__element_centered">
        <p class="form__input__file__note">
          ${fileName? 'Выбран файл: '+fileName : ''}
        </p>
        <label class="form__input__file__wrapper">
          <a class="container__link container__link_underlined">
            Выбрать ${fileName? 'другой' : ''} файл <br>на компьютере
          </a>
          <input name="${props.name}" type="file"
            accept="${props.accept}" 
            class="form__input__file"
            onchange="%{onChange}%">
        </label>
        <span class="form__input__error">${props.error || ''}</span>
      </div>
    `;
  }
}
