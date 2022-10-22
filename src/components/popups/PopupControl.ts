import {EventBus} from '../../modules/EventBus';
import {Block} from '../../modules/Block';

export class PopupControl extends Block {
  constructor(props?: Record<string, unknown>) {
    super(props);
    this.setProps({
      showPopup: () => {
        if (typeof this.props.forId === 'string') {
          EventBus.fire('popupShow', this.props.forId);
        }
      },
    });
  }
}
