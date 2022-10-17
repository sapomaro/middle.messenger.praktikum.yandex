import {Popup} from './Popup';
import {Form} from '../forms/Form';
import {FormError} from '../forms/FormError';
import {StandardButton as Button} from '../buttons/StandardButton';
import {FileInput} from '../inputs/FileInput';
import {StoreSynced} from '../../modules/Store';
import {avatarChangeService, AvatarDataType} from '../../services/profile';
  
export class AvatarPopup extends Popup {
  constructor() {
    super();
    const avatarForm = new Form({
      name: 'avatar',
      fileInput: new FileInput({
        name: 'avatar',
        accept: 'image/png, image/jpeg',
      }),
      formSubmitButton: new (StoreSynced(Button))({
        name: 'submit',
        type: 'submit',
        label: 'Поменять',
        isLoading: false,
      }),
      formError: new (StoreSynced(FormError))({currentError: null}),
      fieldset: () => `
        <h1 class="container__header">Загрузите файл</h1>
        <br>
        %{fileInput}%
        <br>
        %{formSubmitButton}%
        %{formError}%
      `,
    });
    this.setProps({
      popupContent: avatarForm,
    });
    avatarForm.on(Form.EVENTS.SUBMIT_SUCCESS, (data: AvatarDataType) => {
      avatarChangeService(data);
    });
  }
}
