import './common.scss';

import './Head';
import {Block} from '../../modules/Block';

export class Layout extends Block {
  constructor(props: Record<string, unknown>) {
    super(props);
    this.on(Block.EVENTS.BEFORERENDER, () => {
      const title = document.querySelector<HTMLElement>('title');
      if (title) {
        title.innerHTML = '%{title}%';
        this.traverseChildren(document.head);
      }
    });
  }
}
