import {EventBus} from '../../modules/EventBus';
import {Block} from '../../modules/Block';

export class Popup extends Block {
  constructor() {
    super();
    this.setProps({
      onClick: function(event: Event): void {
        if (event.target === this) {
          EventBus.fire('popupHide');
        }
      },
    });
    EventBus.on('popupShow', () => {
      const popup = document.querySelector<HTMLElement>('.popup');
      if (popup) {
        popup.style.display = 'flex';
      }
    });
    EventBus.on('popupHide', () => {
      const popup = document.querySelector<HTMLElement>('.popup');
      if (popup) {
        popup.style.display = 'none';
      }
    });
  }
  render(): string {
    return `
      <div class="popup" onclick="%{onClick}%">
        <div class="container container_narrow">
          %{popupContent}%
        </div>
      </div>
    `;
  }
}
