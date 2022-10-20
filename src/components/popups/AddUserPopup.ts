import {Popup} from './Popup';
import {Form} from '../forms/Form';
import {FormError} from '../forms/FormError';
import {StandardInput as Input} from '../inputs/StandardInput';
import {StandardButton as Button} from '../buttons/StandardButton';
import {StoreSynced} from '../../modules/Store';

export class AddUserPopup extends Popup {
  constructor() {
    super();
    this.setProps({
      popupContent: new Form({
        name: 'addUser',
        Input,
        formSubmitButton: new (StoreSynced(Button))({
          name: 'submit',
          type: 'submit',
          label: 'Добавить',
          isLoading: false,
        }),
        formError: new (StoreSynced(FormError))({currentError: null}),
        fieldset: () => `
          <h1 class="container__header">Добавить пользователя</h1>
          <br>
          %{ Input({"name": "user", "label": "Логин"}) }%
          <br>
          %{formSubmitButton}%
          %{formError}%
        `,
      }),
    });
  }
}
