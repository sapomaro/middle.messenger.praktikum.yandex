import './ChatList.scss';

import {Block} from '../../modules/Block';
import {ChatListItem} from './ChatListItem';
//import {JSONWrapper} from '../../modules/Utils';

type ChatListType = Record<string, unknown>;

export class ChatList extends Block {
  constructor(props: ChatListType) {
    super(props);
    this.setProps({
      //ChatListItem,
      reactivate: () => {
        this.listDescendants((item: ChatListItem) => {
          item.toggleInactive();
        });
      },
    });
  }
  filterChats(searchValue: string) {
    //this.props.allChats
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
      //const chats = JSONWrapper.stringify(props.chats);
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
