import './SearchInput.scss';

import {Input, InputPropsType} from './Input';

export class SearchInput extends Input {
  constructor(props: InputPropsType) {
    super(props);
  }
  render(props: InputPropsType) {
    return `
      <div class="chatlist__search-field-wrapper">
        <input name="${props.name}" type="text"
          class="form__input_field chatlist__search-field"
          value="${props.value || ''}"
          oninput="%{onInput}%"
          onblur="%{onBlur}%"
          onfocus="%{onFocus}%">
        <label class="chatlist__search-label">
          <span class="chatlist__search-label-icon"></span>
          <span class="chatlist__search-label-text">Поиск...</span>
        </label>
      </div>
    `;
  }
}
