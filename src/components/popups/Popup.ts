import './Popup.scss';

import {EventBus} from '../../core/EventBus';
import {Block} from '../../core/Block';
import {Store} from '../../core/Store';

export type PopupProps = {
  [key: string]: string;
  id: string;
};

// Ответ на комментарий в код-ревью:
// Generic classes реализовать пока не удаётся из-за ошибок в типах
// (в частности в HOC-функции StoreSynced - /src/core/Store.ts:50)
export class Popup extends Block {
  constructor(props: PopupProps) {
    super(props);
    this.setProps({
      onClick: function(event: Event): void {
        if (event.target === this) {
          EventBus.emit('popupHide');
        }
      },
    });
    EventBus.on('popupShow', (id: string) => {
      const popup = document.getElementById(id);
      if (popup) {
        popup.style.display = 'flex';
      }
    });
    EventBus.on('popupHide', () => {
      Store.setState({currentError: null});
      const popups = document.querySelectorAll('.popup');
      if (popups) {
        for (const popup of popups) {
          (popup as HTMLElement).style.display = 'none';
        }
      }
    });
  }
  render(props: PopupProps) {
    return `
      <div id="${props.id}" class="popup" onclick="%{onClick}%">
        <div class="container container_narrow">
          %{popupContent}%
        </div>
      </div>
    `;
  }
}
