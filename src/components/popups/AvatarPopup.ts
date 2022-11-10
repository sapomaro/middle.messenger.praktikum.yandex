import {Popup} from './Popup';
import {FormSet} from '../forms/FormSet';
import {Form} from '../forms/Form';
import {FileInput} from '../inputs/FileInput';
import {avatarChangeService} from '../../services/profile';

export class AvatarPopup extends Popup {
  constructor() {
    super({id: 'AvatarPopup'});
    const fileInput = new FileInput({
      name: 'avatar',
      accept: 'image/png, image/jpeg',
    });
    const avatarForm = new FormSet({
      name: 'avatar',
      header: 'Загрузите файл',
      submitLabel: 'Поменять',
      fileInput,
      inputs: '%{fileInput}%',
    });
    this.setPropsWithoutRerender({
      popupContent: avatarForm,
    });
    avatarForm.on(Form.EVENTS.SUBMIT_SUCCESS, () => {
      const file = fileInput.props.file;
      if (file instanceof Blob) {
        avatarChangeService({avatar: file});
      }
    });
  }
}
