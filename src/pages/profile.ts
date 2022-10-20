import {WideLayoutWithSidebar} from '../components/layouts/Wide+Side';
import {Block} from '../modules/Block';
import {Form} from '../components/forms/Form';
import {RowInput} from '../components/inputs/RowInput';
import {RowLink} from '../components/links/RowLink';
import {AvatarControl} from '../components/popups/AvatarControl';
import {AvatarPopup as Popup} from '../components/popups/AvatarPopup';
import {RoundButton} from '../components/buttons/RoundButton';
import {StoreSynced} from '../modules/Store';
import {profileLoadService, ProfileDataType} from '../services/profile';
import {logoutService} from '../services/login';
import {JSONWrapper} from '../modules/Utils';
//import {user} from '../services/_testStubData';

const view = new WideLayoutWithSidebar({
  title: 'Профиль',
  Popup,
  aside: new RoundButton({url: '/messenger'}),
});

export const profileInputs: Array<{
  name: string;
  type?: string;
  label: string;
  value?: string;
  readonly?: boolean;
}> = [
  {name: 'email', type: 'email', label: 'Почта'},
  {name: 'login', type: 'text', label: 'Логин'},
  {name: 'first_name', type: 'text', label: 'Имя'},
  {name: 'second_name', type: 'text', label: 'Фамилия'},
  {name: 'display_name', type: 'text', label: 'Имя в чате'},
  {name: 'phone', type: 'tel', label: 'Телефон'},
];

const profileForm = new (StoreSynced(Form))({
  name: 'profile',
  RowInput, RowLink,
  avatarControl: new (StoreSynced(AvatarControl))(),
  logoutLink: new RowLink({
    url: '/',
    label: 'Выйти',
    style: 'container__link_danger',
    onclick: logoutService,
  }),
  fieldset: () => {
    const user = profileForm.props.user;
    if (user && profileForm.props.inputs) {
      return `
        %{ avatarControl }%
        <h1 class="container__header">${(<ProfileDataType>user).first_name ?? ''}</h1>
        %{ RowInput(${profileForm.props.inputs}...) }%
        <br><br><br>
        %{ RowLink({"url": "/settings/edit", "label": "Изменить данные"}) }%
        %{ RowLink({"url": "/settings/password", "label": "Изменить пароль"}) }%
        %{logoutLink}%
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
      input.readonly = true;
    }
    profileForm.props.inputs = JSONWrapper.stringify(profileInputs);
  }
});

view.props.contents = profileForm;

view.on(Block.EVENTS.MOUNT, profileLoadService);

export {view};
