import {EventBus} from '../modules/EventBus';
import {Block} from '../modules/Block';

export class PopupControl extends Block {
  constructor(props?: Record<string, unknown>) {
    super(props);
    this.setProps({
      showPopup: function(): void {
        EventBus.fire('popupShow');
      },
    });
  }
}
