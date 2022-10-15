import {WideLayoutWithSidebar} from '../components/layouts/Wide+Side';
import {Form} from '../components/forms/Form';
import {StandardButton as Button} from '../components/buttons/StandardButton';
import {RowInput as Input} from '../components/inputs/RowInput';
import {RowLink} from '../components/links/RowLink';
import {AvatarControl} from '../components/popups/AvatarControl';
import {AvatarPopup as Popup} from '../components/popups/AvatarPopup';
import {RoundButtonLink} from '../components/buttons/RoundButtonLink';
import {JSONWrapper} from '../modules/Utils';

const view = new WideLayoutWithSidebar({
  title: 'Профиль',
  Popup, AvatarControl,
  Form, Button, Input, RowLink,
  aside: new RoundButtonLink({url: '/messenger'}),
});

const userData = {
  email: 'pochta@yandex.ru',
  login: 'ivanovivan',
  first_name: 'Иван',
  second_name: 'Иванов',
  display_name: 'Ivan Ivanov',
  phone: '+77777777777',
};

const inputsData: Array<{
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

for (const input of inputsData) {
  input.value = userData[input.name as keyof typeof userData];
  input.readonly = true;
}

const inputs = JSONWrapper.stringify(inputsData);

view.props.contents = new Form({
  name: 'profile',
  action: '',
  fieldset: () => `
    %{ AvatarControl }%
    <h1 class="container__header">${userData.first_name}</h1>
    %{ Input(${inputs}...) }%
    <br><br><br>
    %{ RowLink({"url": "/settings/edit", "label": "Изменить данные"}) }%
    %{ RowLink({"url": "/settings/password", "label": "Изменить пароль"}) }%
    %{ RowLink({"url": "/", "label": "Выйти",
                "style": "container__link_danger"}) }%
    <br><br>
  `,
});

export {view};
