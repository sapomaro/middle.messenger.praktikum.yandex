import './ChatList.scss';

import {EventBus} from '../../modules/EventBus';
import {Store} from '../../modules/Store';
import {Block} from '../../modules/Block';
import {resolveResourceUrl} from '../../services/resources';
import {timeConverter} from '../../services/timeConverter';
import {sanitizeAll} from '../../services/sanitizer';

import type {ChatT} from '../../constants/types';

export class ChatListItem extends Block {
  constructor(props: ChatT) {
    super(props);
    const activeChatId = Store.getState().activeChatId;
    this.setProps({
      active: (props.id === activeChatId),
      activate: () => {
        setTimeout(() => {
          this.toggleActive();
          const chatId = this.props.id ?? 0;
          EventBus.emit('chatSelected', chatId);
          Store.setState({activeChatId: chatId});
        }, 1);
      },
    });
  }
  toggleActive() {
    this.setProps({active: true});
  }
  toggleInactive() {
    this.setProps({active: false});
  }
  toggleShow() {
    this.setProps({hidden: false});
  }
  toggleHide() {
    this.setProps({hidden: true});
  }
  render(props: ChatT) {
    props = sanitizeAll(props);
    let avatar = '';
    if (typeof props.avatar === 'string') {
      avatar = resolveResourceUrl(props.avatar);
    }
    let lastMsg = {
      time: '',
      content: '',
    };
    if (typeof props.last_message === 'object' &&
        props.last_message !== null) {
      lastMsg = props.last_message as typeof lastMsg;
    }
    const msgSlice = (str: string) => {
      return str.slice(0, 40);
    };
    return `
      <li class="chatlist__item 
        ${props.active? 'chatlist__item_active' : ''}
        ${props.hidden? 'chatlist__item_hidden' : ''}"
        onclick="%{activate}%">
        <div class="chatlist__item__wrapper">
          <div class="chatlist__item__avatar"
          ${avatar? 'style="background-image: url('+avatar+')"' : ''}></div>
          <div class="chatlist__item__text">
            <div class="chatlist__item__name">${props.title||''}</div>
            <div class="chatlist__item__message">
              <span class="chatlist__item__message__quote">
                ${msgSlice(lastMsg.content || 'В этом чате пока нет сообщений')}
              </span>
            </div>
          </div>
          <div class="chatlist__item__info">
            <div class="chatlist__item__time">
              ${timeConverter(lastMsg.time)}
            </div>
            <div class="chatlist__item__unreads">
              <span class="chatlist__item__unreads__count"
                >${props.unread_count||''}</span>
            </div>
          </div>
        </div>
      </li>
    `;
  }
}
