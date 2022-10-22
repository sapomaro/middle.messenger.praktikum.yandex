import './ChatBox.scss';

import {EventBus} from '../../modules/EventBus';
import {Block} from '../../modules/Block';
import {ChatBoxHeader} from './ChatBoxHeader';
import {ChatBoxFooter} from './ChatBoxFooter';
import {Message} from './Message';
import {JSONWrapper} from '../../modules/Utils';

type ChatBoxType = Record<string, unknown>;

export class ChatBox extends Block {
  constructor(props: ChatBoxType) {
    super(props);
    this.setProps({
      ChatBoxHeader,
      ChatBoxFooter,
      Message,
    });
    this.on(`${Block.EVENTS.MOUNT}, ${Block.EVENTS.REMOUNT}`, () => {
      EventBus.fire('updateLayoutScrollPosition');
    });
  }
  render(props: ChatBoxType) {
    if (props.messages) {
      const messages = JSONWrapper.stringify(props.messages);
      return `
        <div class="chatbox__header">
          %{ChatBoxHeader}%
        </div>
        <div class="chatbox__body">
          <div class="chatbox__date">19 июня (вс)</div>

          %{ Message(${messages}...) }%
        </div>
        <div class="chatbox__footer">
          %{ChatBoxFooter}%
        </div>
      `;
    } else {
      return `
        <div class="chatbox__stub">
          Выберите чат, чтобы отправить сообщение
        </div>
      `;
    }
  }
}
