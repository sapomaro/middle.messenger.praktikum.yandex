import {WideLayoutWithSidebar} from '../components/layouts/Wide+Side';
import {Form} from '../components/forms/Form';
import {FormError} from '../components/forms/FormError';
import {StandardButton as Button} from '../components/buttons/StandardButton';
import {RowInput as Input} from '../components/inputs/RowInput';
import {AvatarControl} from '../components/popups/AvatarControl';
import {Popup} from '../components/popups/Popup';
import {RoundButtonLink} from '../components/buttons/RoundButtonLink';
import {StoreSynced} from '../modules/Store';
import {profilePasswordService, ProfilePassType} from '../services/profile';

const view = new WideLayoutWithSidebar({
  title: 'Изменить пароль',
  Popup,
  aside: new RoundButtonLink({url: '/settings'}),
});

const profileForm = new Form({
  name: 'changepassword',
  Input, AvatarControl,
  formSubmitButton: new (StoreSynced(Button))({
    name: 'submit',
    type: 'submit',
    label: 'Сохранить',
    isLoading: false,
  }),
  formError: new (StoreSynced(FormError))({currentFormError: null}),
  fieldset: () => `
    %{ AvatarControl({"unclickable": true}) }%
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
    <br><br><br>
    %{formSubmitButton}%
    %{formError}%
    <br><br>
  `,
});

profileForm.on(Form.EVENTS.SUBMIT_SUCCESS, (data: ProfilePassType) => {
  profilePasswordService(data);
});

view.props.contents = profileForm;

export {view};
