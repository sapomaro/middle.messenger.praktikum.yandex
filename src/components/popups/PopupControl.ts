import {EventBus} from '../../modules/EventBus';
import {Block} from '../../modules/Block';

export class PopupControl extends Block {
  constructor(props?: Record<string, unknown>) {
    super(props);
    this.setProps({
      showPopup: this.showPopup.bind(this),
    });
  }
  showPopup() {
    if (typeof this.props.forId === 'string') {
      EventBus.emit('popupShow', this.props.forId);
    }
  }
}
