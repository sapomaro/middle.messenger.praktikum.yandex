import './common.scss';
import './Wide.scss';

import '../Head';
import {Block} from '../../modules/Block';

export class WideLayout extends Block {
  constructor(props: Record<string, any>) {
    super(props);
  }
  render(): string {
    return `
      <div class="root">
        <main class="container container_wide">
          %{contents}%
        </main>
      </div>
    `;
  }
}
