import './Messages.scss';

import {Block} from '../../modules/Block';
import {timeConverter} from '../../services/timeConverter';
import {sanitizeAll} from '../../services/sanitizer';

import type {UserT} from '../../constants/types';

export class Messages extends Block {
  constructor(props?: Record<string, unknown>) {
    super(props);
    //this.setProps({activeChatMessages: []});
  }
  render(props: Record<string, unknown>) {
    const messages = props.activeChatMessages;
    if (typeof messages === 'object' &&
        messages instanceof Array) {
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
        <ul class="chatbox__messages__wrapper">
          %{messages}%
        </ul>
      `;
    } else {
      return ``;
    }
  }
}

export class Message extends Block {
  constructor(props: Record<string, string>) {
    super(props);
  }
  render(props: Record<string, string>) {
    props = sanitizeAll(props);
    return `
      <li class="chatbox__message chatbox__message_${props.direction}">
        <span class="chatbox__message__text">${props.content || ''}</span>
        <span class="chatbox__message__info">
          <span class="chatbox__message__status">
            ${ props.status? '✓✓' : '' }&nbsp;
          </span>
          <time class="chatbox__message__time">
            ${timeConverter(props.time)}
          </time>
        </span>
      </li>
    `;
  }
}
