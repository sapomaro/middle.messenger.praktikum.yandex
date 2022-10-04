import '/src/components/layouts/common.scss';
import '/src/components/layouts/Wide.scss';
import '/src/components/layouts/Narrow.scss';

import '/src/components/Head';
import {Block} from '/src/modules/Block';

export class WideLayoutWithSidebar extends Block {
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
        <aside class="sidebar sidebar_nav">
          <form action="%{backButtonLink}%" class="sidebar__control">
            <button 
              class="form__button form__button_standard form__button_round">
                ⬅
            </button>
          </form>
        </aside>
        <main class="container container_wide">
          %{contents}%
        </main>
      </div>
    `;
  }
}
