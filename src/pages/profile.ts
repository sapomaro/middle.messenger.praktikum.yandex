import {WideLayoutWithSidebar} from '../components/layouts/Wide+Side';
import {Block} from '../core/Block';
import {Form} from '../components/forms/Form';
import {RowInput} from '../components/inputs/RowInput';
import {RowLink} from '../components/links/RowLink';
import {AvatarControl} from '../components/popups/AvatarControl';
import {LoadPopup} from '../components/popups/LoadPopup';
import {AvatarPopup} from '../components/popups/AvatarPopup';
import {RoundButton} from '../components/buttons/RoundButton';
import {StoreSynced} from '../core/Store';
import {authControlService} from '../services/login';
import {logoutService} from '../services/login';
import {sanitizeAll} from '../services/sanitizer';
import {JSONWrapper} from '../core/Utils';
import type {UserT} from '../constants/types';

const view = new WideLayoutWithSidebar({
  title: 'Профиль',
  popup: [LoadPopup, AvatarPopup],
  aside: new RoundButton({url: '/messenger', label: '⬅'}),
});

view.on(Block.EVENTS.BEFORERENDER, authControlService);

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
  avatarControl: new (StoreSynced(AvatarControl))({forId: 'AvatarPopup'}),
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
        <h1 class="container__header">
          ${sanitizeAll((<UserT>user).first_name) ?? ''}
        </h1>
        %{ RowInput(${profileForm.props.inputs}...) }%
        <br class="form__section-break">
        %{ RowLink({"url": "/settings/edit", "label": "Изменить данные"}) }%
        %{ RowLink({"url": "/settings/password", "label": "Изменить пароль"}) }%
        %{logoutLink}%
      `;
    } else {
      return `<h1 class="container__header">Загружаю...</h1>`;
    }
  },
});

profileForm.on(Block.EVENTS.BEFORERENDER, () => {
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

export {view};
