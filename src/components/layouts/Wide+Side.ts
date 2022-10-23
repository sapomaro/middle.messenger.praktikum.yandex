import './Wide.scss';
import './Narrow.scss';

import {Layout} from './Layout';

export class WideLayoutWithSidebar extends Layout {
  constructor(props: Record<string, unknown>) {
    super(props);
  }
  render(): string {
    return `
      %{popup}%
      <div class="root">
        <aside class="sidebar sidebar_nav">
          <div class="sidebar__control">
            %{aside}%
          </div>
        </aside>
        <main class="container container_wide">
          %{contents}%
        </main>
      </div>
    `;
  }
}
