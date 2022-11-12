import './Narrow.scss';

import {Layout} from './Layout';

export class NarrowLayout extends Layout {
  constructor(props: Record<string, unknown>) {
    super(props);
  }
  render(): string {
    return `
      %{popup}%
      <div class="root root_narrow">
        <main class="container container_narrow">
          %{contents}%
        </main>
      </div>
    `;
  }
}
