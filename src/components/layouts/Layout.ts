import './common.scss';

import './Head';
import {Block} from '../../core/Block';

export class Layout extends Block {
  constructor(props: Record<string, unknown>) {
    super(props);
    this.on(Block.EVENTS.BEFORERENDER, () => {
      this.updateTitle();
    });
  }
  updateTitle(newTitle = '') {
    const title = document.querySelector<HTMLElement>('title');
    if (!title) return;
    if (newTitle) {
      this.props.title = newTitle;
    }
    title.innerHTML = '%{title}%';
    this.traverseChildren(document.head);
  }
}
