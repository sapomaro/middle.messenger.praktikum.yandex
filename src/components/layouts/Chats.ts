import './common.scss';
import './Chats.scss';

import '../Head';
import {Block} from '../../modules/Block';

export class ChatsLayout extends Block {
  constructor(props: Record<string, unknown>) {
    super(props);
    this.on('mounted', () => {
      const popup = document.querySelector('.popup') as HTMLElement;
      popup.addEventListener('click', (event: Event) => {
        if (event.target === popup) {
          popup.style.display = 'none';
        }
      });
    });
  }
  render(): string {
    return `
      <div class="popup">
        <div class="container container_narrow">
          %{popup}%
        </div>
      </div>
      <div class="root">
        <aside class="sidebar sidebar_chatlist scrollable">
          %{ Chatlist }%
        </aside>
        <main class="container container_chatbox scrollable">
          <div class="chatbox__header">
            %{ ChatboxHeader }%
          </div>
          <div class="chatbox__body">
            %{ ChatboxBody }%
          </div>
          <div class="chatbox__footer">
            %{ ChatboxFooter }%
          </div>
        </main>
      </div>
    `;
  }
}
