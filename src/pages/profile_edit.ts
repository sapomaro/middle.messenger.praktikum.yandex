import {WideLayoutWithSidebar} from '../components/layouts/Wide+Side';
import {Block} from '../modules/Block';
import {Form} from '../components/forms/Form';
import {FormError} from '../components/forms/FormError';
import {StandardButton as Button} from '../components/buttons/StandardButton';
import {RowInput as Input} from '../components/inputs/RowInput';
import {AvatarControl} from '../components/popups/AvatarControl';
import {Popup} from '../components/popups/Popup';
import {RoundButtonLink} from '../components/buttons/RoundButtonLink';
import {JSONWrapper} from '../modules/Utils';
import {profileInputs} from './profile';
import {StoreSynced} from '../modules/Store';
import {profileLoadService, profileEditService,
  ProfileDataType} from '../services/profile';
//import {user} from '../services/_testStubData';

const view = new WideLayoutWithSidebar({
  title: 'Изменить данные',
  Popup,
  aside: new RoundButtonLink({url: '/settings'}),
});

const profileForm = new (StoreSynced(Form))({
  name: 'profile',
  Input,
  avatarControl: new (StoreSynced(AvatarControl))({unclickable: true}),
  formSubmitButton: new (StoreSynced(Button))({
    name: 'submit',
    type: 'submit',
    label: 'Сохранить',
    isLoading: false,
  }),
  formError: new (StoreSynced(FormError))({currentError: null}),
  fieldset: () => {
    const user = profileForm.props.user;
    if (user && profileForm.props.inputs) {
      return `
        %{avatarControl}%
        %{ Input(${profileForm.props.inputs}...) }%
        <br><br><br>
        %{formSubmitButton}%
        %{formError}%
        <br><br>
      `;
    } else {
      return `<h1 class="container__header">Загружаю...</h1>`;
    }
  },
});

profileForm.on(Block.EVENTS.UNMOUNT, () => {
  const user = profileForm.props.user;
  if (user) {
    for (const input of profileInputs) {
      input.value = user[input.name as keyof typeof user];
      input.readonly = false;
    }
    profileForm.props.inputs = JSONWrapper.stringify(profileInputs);
  }
});

profileForm.on(Form.EVENTS.SUBMIT_SUCCESS, (data: ProfileDataType) => {
  profileEditService(data);
});

view.props.contents = profileForm;

view.on(Block.EVENTS.MOUNT, profileLoadService);

export {view};
