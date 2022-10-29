import './Chats.scss';

import {EventBus} from '../../core/EventBus';
import {Layout} from './Layout';

export class ChatsLayout extends Layout {
  constructor(props: Record<string, unknown>) {
    super(props);
    EventBus.on('updateLayoutScrollPosition', () => {
      const container = document.querySelector<HTMLElement>('main');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    });
  }
  render(): string {
    return `
      %{popup}% 
      <div class="root">
        <aside class="sidebar sidebar_chatlist scrollable">
          %{aside}%
        </aside>
        <main class="container container_chatbox scrollable">
          %{contents}%
        </main>
      </div>
    `;
  }
}
