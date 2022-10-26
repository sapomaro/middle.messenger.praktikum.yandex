import './Narrow.scss';

import {Layout} from './Layout';

export class NarrowLayout extends Layout {
  constructor(props: Record<string, unknown>) {
    super(props);
  }
  render(): string {
    return `
      %{popup}%
      <div class="root">
        <main class="container container_narrow">
          %{contents}%
        </main>
      </div>
    `;
  }
}
