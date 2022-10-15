import './common.scss';

import './Head';
import {Block} from '../../modules/Block';

export class Layout extends Block {
  constructor(props: Record<string, unknown>) {
    super(props);
    this.on(Block.EVENTS.UNMOUNT, () => {
      const title = document.querySelector<HTMLElement>('title');
      if (title) {
        title.innerHTML = '%{title}%';
        this.traverseChildren(document.head);
      }
    });
    this.on('mounted', () => {
      const popup = document.querySelector<HTMLElement>('.popup');
      if (popup) {
        popup.addEventListener('click', (event: Event) => {
          if (event.target === popup) {
            popup.style.display = 'none';
          }
        });
      }
    });
  }
}
