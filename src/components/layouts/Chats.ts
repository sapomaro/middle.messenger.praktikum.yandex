import './Chats.scss';

import {Layout} from './Layout';

export class ChatsLayout extends Layout {
  constructor(props: Record<string, unknown>) {
    super(props);
  }
  render(): string {
    return `
      %{Popup}% 
      <div class="root">
        <aside class="sidebar sidebar_chatlist scrollable">
          %{Chatlist}%
        </aside>
        <main class="container container_chatbox scrollable">
          <div class="chatbox__header">
            %{ChatboxHeader}%
          </div>
          <div class="chatbox__body">
            %{ChatboxBody}%
          </div>
          <div class="chatbox__footer">
            %{ChatboxFooter}%
          </div>
        </main>
      </div>
    `;
  }
}
