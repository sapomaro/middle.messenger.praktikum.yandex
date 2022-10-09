import './Wide.scss';
import './Narrow.scss';

import {Layout} from './Layout';

export class WideLayoutWithSidebar extends Layout {
  constructor(props: Record<string, unknown>) {
    super(props);
  }
  render(): string {
    return `
      %{Popup}%
      <div class="root">
        <aside class="sidebar sidebar_nav">
          %{BackButtonLink}%
        </aside>
        <main class="container container_wide">
          %{contents}%
        </main>
      </div>
    `;
  }
}
