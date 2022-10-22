import {Popup, PopupProps} from './Popup';
import {FormSet} from '../forms/FormSet';

export class AddChatPopup extends Popup {
  constructor(props: PopupProps) {
    super(props);
    this.setProps({
      popupContent: new FormSet({
        name: 'addChat',
        header: 'Добавить чат',
        submitLabel: 'Добавить',
        inputs: '%{ Input({"name": "chat", "label": "Чат"}) }%',
      }),
    });
  }
}
