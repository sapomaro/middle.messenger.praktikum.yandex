import {Block} from '../../modules/Block';
import {ChatBoxControl} from '../popups/ChatBoxControl';

export class ChatBoxHeader extends Block {
  constructor() {
    super();
    this.setProps({
      addUser: new ChatBoxControl({
        label: 'Добавить пользователя',
        iconStyle: 'chatbox__icon__circle',
        iconText: '+',
        forId: 'AddUserPopup',
      }),
      remUser: new ChatBoxControl({
        label: 'Удалить пользователя',
        iconStyle: 'chatbox__icon__circle',
        iconText: '×',
        forId: 'DeleteUserPopup',
      }),
    });
  }
  render(): string {
    return `
      <div class="chatbox__header__avatar"></div>

      <h2 class="chatbox__header__text">%{user}%</h2>

      <label class="chatbox__header__control__wrapper">
        <input type="checkbox" 
          class="chatbox__dropdown__toggle chatbox__element_hidden">
        <a class="chatbox__header__control chatbox__dropdown__control">⋮</a>
        <span class="chatbox__dropdown chatbox__dropdown_top">
          <span class="chatbox__dropdown__menu">
            %{addUser}%
            %{remUser}%
          </span>
        </span>
      </label>
    `;
  }
}
