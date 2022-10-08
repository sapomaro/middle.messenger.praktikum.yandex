import './Wide.scss';

import {Layout} from './Layout';

export class WideLayout extends Layout {
  constructor(props: Record<string, unknown>) {
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
