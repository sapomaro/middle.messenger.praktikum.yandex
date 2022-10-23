import './ChatBox.scss';

import {EventBus} from '../../modules/EventBus';
import {Store, StoreSynced} from '../../modules/Store';
import {Block} from '../../modules/Block';
import {ChatBoxHeader} from './ChatBoxHeader';
import {ChatBoxFooter} from './ChatBoxFooter';
import {Messages} from './Messages';

import type {ChatT} from '../../constants/types';

type ChatBoxType = Record<string, unknown>;

export class ChatBox extends Block {
  constructor(props?: ChatBoxType) {
    super(props);
    const msgArea = new (StoreSynced(Messages))();
    this.setProps({
      ChatBoxHeader,
      ChatBoxFooter,
      msgArea,
    });
    msgArea.on(`${Block.EVENTS.MOUNT}, ${Block.EVENTS.REMOUNT}`, () => {
      EventBus.fire('updateLayoutScrollPosition');
    });
    EventBus.on('chatSelected', (chatId: number) => {
      let chat: Record<string, unknown> | null = null;
      const chats = Store.getState().chats;
      if (typeof chats === 'object' && chats instanceof Array) {
        chat = chats.find((item: ChatT) =>
          (item.id === chatId)) as ChatT;
      }
      if (chat) {
        this.setProps({id: chat.id, title: chat.title});
      } else {
        this.setProps({id: 0});
      }
    });
  }
  render(props: ChatBoxType) {
    if (props.id) {
      return `
        <div class="chatbox__header">
          %{ChatBoxHeader}%
        </div>
        <div class="chatbox__body">
          %{msgArea}%
        </div>
        <div class="chatbox__footer">
          %{ChatBoxFooter}%
        </div>
      `;
    } else {
      return `
        <div class="chatbox__stub">
          Выберите или создайте чат, чтобы отправить сообщение
        </div>
      `;
    }
  }
}
