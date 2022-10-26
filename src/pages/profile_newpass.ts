import {WideLayoutWithSidebar} from '../components/layouts/Wide+Side';
import {Block} from '../core/Block';
import {Form} from '../components/forms/Form';
import {FormError} from '../components/forms/FormError';
import {StandardButton as Button} from '../components/buttons/StandardButton';
import {RowInput as Input} from '../components/inputs/RowInput';
import {LoadPopup} from '../components/popups/LoadPopup';
import {AvatarControl} from '../components/popups/AvatarControl';
import {RoundButton} from '../components/buttons/RoundButton';
import {StoreSynced} from '../core/Store';
import {authControlService} from '../services/login';
import {profilePasswordService} from '../services/profile';

const view = new WideLayoutWithSidebar({
  title: 'Изменить пароль',
  popup: new LoadPopup(),
  aside: new RoundButton({url: '/settings', label: '⬅'}),
});

view.on(Block.EVENTS.BEFORERENDER, authControlService);

const profileForm = new Form({
  name: 'changepassword',
  Input,
  avatarControl: new (StoreSynced(AvatarControl))({unclickable: true}),
  formSubmitButton: new (StoreSynced(Button))({
    name: 'submit',
    type: 'submit',
    label: 'Сохранить',
    isLoading: false,
  }),
  formError: new (StoreSynced(FormError))({currentError: null}),
  fieldset: () => `
    %{avatarControl}%
    %{ Input({
      "label": "Старый пароль", "name": "oldPassword", "type": "password",
      "placeholder": "********"
    }) }%
    %{ Input({
      "label": "Новый пароль", "name": "newPassword", "type": "password",
      "placeholder": "********"
    }) }%
    %{ Input({
      "label": "Повторите новый пароль", "name": "newPassword2",
      "type": "password",
      "placeholder": "********"
    }) }%
    <br class="form__section-break">
    %{formSubmitButton}%
    %{formError}%
  `,
});

profileForm.on(Form.EVENTS.SUBMIT_SUCCESS, profilePasswordService);

view.props.contents = profileForm;

export {view};
