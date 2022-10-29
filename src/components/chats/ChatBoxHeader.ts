import {Block} from '../../core/Block';
import {ChatBoxControl} from '../popups/ChatBoxControl';
import {StandardButton as Button} from '../buttons/StandardButton';
import {PopupControl} from '../popups/PopupControl';

export class ChatBoxHeader extends Block {
  constructor() {
    super();
    const deleteChatControl = new PopupControl({forId: 'DeleteChatPopup'});
    this.setProps({
      addUser: new ChatBoxControl({
        label: 'Добавить пользователя',
        iconStyle: 'chatbox__icon-circle',
        iconText: '+',
        forId: 'AddUserPopup',
      }),
      remUser: new ChatBoxControl({
        label: 'Удалить пользователя',
        iconStyle: 'chatbox__icon-circle chatbox__icon_danger',
        iconText: '×',
        forId: 'DeleteUserPopup',
      }),
      deleteChat: new Button({
        name: 'deleteChat',
        label: 'Удалить чат',
        style: 'form__button_danger',
        onclick: () => {
          deleteChatControl.showPopup();
        },
      }),
    });
  }
  render(): string {
    return `
      <div class="chatbox__header-avatar"></div>

      <h2 class="chatbox__header-text">%{title}%</h2>

      <label class="chatbox__header-control-wrapper">
        <input type="checkbox" 
          class="chatbox__dropdown-toggle chatbox__element_hidden">
        <a class="chatbox__header-control chatbox__dropdown-control">⋮</a>
        <span class="chatbox__dropdown chatbox__dropdown_top">
          <span class="chatbox__dropdown-menu">
            %{addUser}%
            %{remUser}%
            %{deleteChat}%
          </span>
        </span>
      </label>
    `;
  }
}
