import '/src/components/layouts/common.scss';
import '/src/components/layouts/Narrow.scss';

import '/src/components/Head';
import {Block} from '/src/modules/Block';

export class NarrowLayout extends Block {
  constructor(props) {
    super(props);
  }
  render(props) {
    return `
      <div class="root">
        <main class="container container_narrow">
          %{contents}%
        </main>
      </div>
    `;
  }
}
