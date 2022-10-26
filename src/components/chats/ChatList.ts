import './ChatList.scss';

import {Block} from '../../core/Block';
import {ChatListItem} from './ChatListItem';

import type {ChatT} from '../../constants/types';

type ChatListType = Record<string, unknown>;

export class ChatList extends Block {
  constructor(props: ChatListType) {
    super(props);
    this.setProps({
      reactivate: () => {
        this.listDescendants((item: ChatListItem) => {
          item.toggleInactive();
        });
      },
    });
  }
  filterChats(searchValue: string) {
    this.listDescendants((item: ChatListItem) => {
      if (!item.toggleShow || !item.toggleHide) {
        return;
      }
      if (searchValue === '') {
        item.toggleShow();
        return;
      }
      let chatValue = '';
      if (item.props.title) {
        chatValue += item.props.title;
      }
      const chat = item.props as ChatT;
      if (chat.last_message !== null &&
          typeof chat.last_message?.content === 'string') {
        chatValue += chat.last_message.content;
      }
      if (chatValue.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1) {
        item.toggleShow();
      } else {
        item.toggleHide();
      }
    });
  }
  render(props: ChatListType) {
    if (typeof props.chats === 'object' && props.chats instanceof Array) {
      const chatList = [];
      for (const chat of props.chats) {
        chatList.push(new ChatListItem(chat));
      }
      this.props.chatList = chatList;
      return `
        <ul onclick="%{reactivate}%">
          %{chatList}%
        </ul>
      `;
    } else {
      return ``;
    }
  }
}
