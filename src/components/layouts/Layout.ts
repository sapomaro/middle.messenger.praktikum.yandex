import './common.scss';

import '../Head';
import {Block} from '../../modules/Block';

export class Layout extends Block {
  constructor(props: Record<string, unknown>) {
    super(props);
    this.on('preparing', () => {
      const title = document.querySelector('title') as HTMLElement;
      title.innerHTML = '%{title}%';
      this.traverseChildren(document.head);
    });
    this.on('mounted', () => {
      const popup = document.querySelector('.popup') as HTMLElement;
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
