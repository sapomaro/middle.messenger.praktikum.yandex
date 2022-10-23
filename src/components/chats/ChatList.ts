import './ChatList.scss';

import {Block} from '../../modules/Block';
import {ChatListItem} from './ChatListItem';

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
