import './SearchInput.scss';

import {Input, InputPropsType} from './Input';

export class SearchInput extends Input {
  constructor(props: InputPropsType) {
    super(props);
  }
  render(props: InputPropsType) {
    return `
      <div class="chatlist__search__field__wrapper">
        <input name="${props.name}" type="text"
          class="form__input__field chatlist__search__field"
          value="${props.value || ''}"
          oninput="%{onInput}%"
          onblur="%{onBlur}%"
          onfocus="%{onFocus}%">
        <label class="chatlist__search__label">
          <span class="chatlist__search__label__icon"></span>
          <span class="chatlist__search__label__text">Поиск...</span>
        </label>
      </div>
    `;
  }
}
