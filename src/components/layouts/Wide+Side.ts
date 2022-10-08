import './common.scss';
import './Wide.scss';
import './Narrow.scss';

import '../Head';
import {Block} from '../../modules/Block';

export class WideLayoutWithSidebar extends Block {
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
        <aside class="sidebar sidebar_nav">
          %{BackButtonLink}%
        </aside>
        <main class="container container_wide">
          %{contents}%
        </main>
      </div>
    `;
  }
}

/*          <form action="%{backButtonLink}%" class="sidebar__control">
            <button 
              class="form__button form__button_standard form__button_round">
                ⬅
            </button>
          </form>*/
