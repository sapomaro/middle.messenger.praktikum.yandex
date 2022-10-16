import './ChatList.scss';

import {Block} from '../../modules/Block';
import {JSONWrapper} from '../../modules/Utils';

type ChatListType = Record<string, unknown>;

export class ChatList extends Block {
  constructor(props: ChatListType) {
    super(props);
    this.setProps({ChatListItem});
  }
  filterChats(searchValue: string) {
    // this.props.allChats 
    if (this.props.chats instanceof Array) {
      return this.props.chats.filter((chat: Record<string, unknown>) => {
         for (const chatValue of Object.values(chat)) {
           if (typeof chatValue === 'string' &&
              chatValue.toLowerCase()
                .indexOf(searchValue.toLowerCase()) !== -1) {
             return true;
           }
         }
         return false;
      });
    }
    return [];
  }
  render(props: ChatListType) {
    if (props.chats) {
      const chats = JSONWrapper.stringify(props.chats);
      return `
        <ul>
          %{ ChatListItem(${chats}...) }%
        </ul>
      `;
    } else {
      return ``;
    }
  }
}

const ChatListItem = (props: Record<string, unknown>): string => `
  <li class="chatlist__item ${props.active ? 'chatlist__item_active' : ''}">
    <div class="chatlist__item__wrapper">
      <div class="chatlist__item__avatar"></div>
      <div class="chatlist__item__text">
        <div class="chatlist__item__name">${props.user}</div>
        <div class="chatlist__item__message">
          <span class="chatlist__item__message__quote">${props.quote}</span>
        </div>
      </div>
      <div class="chatlist__item__info">
        <div class="chatlist__item__time">${props.when}</div>
        <div class="chatlist__item__unreads">
          <span class="chatlist__item__unreads__count"
            >${props.unreads||''}</span>
        </div>
      </div>
    </div>
  </li>
`;
