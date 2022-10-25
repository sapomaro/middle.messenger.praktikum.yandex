import './Messages.scss';

import {Block} from '../../core/Block';
import {timeConverter} from '../../services/timeConverter';
import {sanitizeAll} from '../../services/sanitizer';

import type {UserT} from '../../constants/types';

export class Messages extends Block {
  constructor(props?: Record<string, unknown>) {
    super(props);
  }
  render(props: Record<string, unknown>) {
    const messages = props.activeChatMessages;
    if (typeof messages !== 'object' ||
        !(messages instanceof Array)) {
      return '';
    }
    if (props.isLoading && messages.length === 0) {
      return `
        <div class="chatbox__stub">
          Загрузка...
        </div>
      `;
    } else {
      const msgItems = [];
      const user: UserT = this.props.user as UserT;
      if (user && 'id' in user && typeof user.id === 'number') {
        for (const msg of messages) {
          if (msg.type !== 'message') {
            continue;
          }
          const direction = (msg.user_id === user.id? 'out' : 'inc');
          msgItems.push(new Message({...msg, direction}));
        }
      }
      this.props.messages = msgItems;
      return `
        <ul class="chatbox__messages-wrapper">
          %{messages}%
        </ul>
      `;
    }
  }
}

export class Message extends Block {
  constructor(props: Record<string, string>) {
    super(props);
  }
  render(props: Record<string, string>) {
    props = sanitizeAll(props);
    if (typeof props.content === 'string' && props.content !== '') {
      return `
        <li class="chatbox__message chatbox__message_${props.direction}">
          <span class="chatbox__message-text">${props.content}</span>
          <span class="chatbox__message-info">
            <span class="chatbox__message-status">
              ${ props.status? '✓✓' : '' }&nbsp;
            </span>
            <time class="chatbox__message__time">
              ${timeConverter(props.time)}
            </time>
          </span>
        </li>
      `;
    } else {
      return '';
    }
  }
}
