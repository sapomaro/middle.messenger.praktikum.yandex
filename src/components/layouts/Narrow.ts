import './common.scss';
import './Narrow.scss';

import '../Head';
import {Block} from '../../modules/Block';

export class NarrowLayout extends Block {
  constructor(props: Record<string, any>) {
    super(props);
  }
  render(): string {
    return `
      <div class="root">
        <main class="container container_narrow">
          %{contents}%
        </main>
      </div>
    `;
  }
}
