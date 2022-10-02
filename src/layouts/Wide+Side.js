import '/src/components/Head.js';

import '/src/layouts/common.scss';
import '/src/layouts/Wide.scss';
import '/src/layouts/Narrow.scss';

export const WideSideLayout = () => {
  document.body.innerHTML = `
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

  const popup = document.querySelector('.popup');
  popup.addEventListener('click', (event) => {
    if (event.target === popup) {
      popup.style.display = 'none';
    }
  });
};
