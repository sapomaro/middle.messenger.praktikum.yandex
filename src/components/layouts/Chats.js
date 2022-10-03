import '/src/components/layouts/common.scss';
import '/src/components/layouts/Chats.scss';

import '/src/components/Head.js';
import {Block} from '/src/modules/Block.js';

export class ChatsLayout extends Block {
  constructor(props) {
    super(props);
    this.on('mounted', () => {
      const popup = document.querySelector('.popup');
      popup.addEventListener('click', (event) => {
        if (event.target === popup) {
          popup.style.display = 'none';
        }
      });
    });
  }
  render(props) {
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
