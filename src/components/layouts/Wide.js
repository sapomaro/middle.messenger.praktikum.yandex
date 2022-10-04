import '/src/components/layouts/common.scss';
import '/src/components/layouts/Wide.scss';

import '/src/components/Head';
import {Block} from '/src/modules/Block';

export class WideLayout extends Block {
  constructor(props) {
    super(props);
  }
  render(props) {
    return `
      <div class="root">
        <main class="container container_wide">
          %{contents}%
        </main>
      </div>
    `;
  }
}
