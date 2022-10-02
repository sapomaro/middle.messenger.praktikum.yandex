import '/src/components/Head.js';

import '/src/layouts/common.scss';
import '/src/layouts/Wide.scss';

export const WideLayout = () => {
  document.body.innerHTML = `
    <div class="root">
      <main class="container container_wide">
        %{contents}%
      </main>
    </div>
  `;
};
