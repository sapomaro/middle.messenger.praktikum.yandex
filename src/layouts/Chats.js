import {ProtoPages} from '/src/modules/ProtoPages.js';

import '/src/components/Head.js';
import '/src/layouts/common.scss';
import '/src/layouts/Chats.scss';

ProtoPages.on('init', () => {
  document.body.innerHTML = `
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
  const popup = document.querySelector('.popup');
  popup.addEventListener('click', (event) => {
    if (event.target === popup) {
      popup.style.display = 'none';
    }
  });
});
