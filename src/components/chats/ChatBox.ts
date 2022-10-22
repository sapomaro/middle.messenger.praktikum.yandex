import './ChatBox.scss';

import {EventBus} from '../../modules/EventBus';
import {Store} from '../../modules/Store';
import {Block} from '../../modules/Block';
import {ChatBoxHeader} from './ChatBoxHeader';
import {ChatBoxFooter} from './ChatBoxFooter';
import {Message} from './Message';
import {ChatDataType} from '../../services/chats';

//import {JSONWrapper} from '../../modules/Utils';

type ChatBoxType = Record<string, unknown>;

export class ChatBox extends Block {
  constructor(props?: ChatBoxType) {
    super(props);
    this.setProps({
      ChatBoxHeader,
      ChatBoxFooter,
      Message,
    });
    this.on(`${Block.EVENTS.MOUNT}, ${Block.EVENTS.REMOUNT}`, () => {
      EventBus.fire('updateLayoutScrollPosition');
    });
    EventBus.on('chatSelected', (chatId: number) => {
      let chat: Record<string, unknown> | null = null;
      const chats = Store.getState().chats;
      if (typeof chats === 'object' && chats instanceof Array) {
        chat = chats.find((item: ChatDataType) => (item.id === chatId)) as ChatDataType;
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
      //const messages = JSONWrapper.stringify(props.messages);
      //%{ Message(${messages}...) }%
      return `
        <div class="chatbox__header">
          %{ChatBoxHeader}%
        </div>
        <div class="chatbox__body">
          <div class="chatbox__date">19 июня (вс)</div>

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
