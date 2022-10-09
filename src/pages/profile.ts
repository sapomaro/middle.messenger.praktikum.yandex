import {WideLayoutWithSidebar} from '../components/layouts/Wide+Side';
import {Form} from '../components/forms/Form';
import {StandardButton as Button} from '../components/forms/StandardButton';
import {RowInput as Input} from '../components/forms/RowInput';
import {RowLink} from '../components/forms/RowLink';
import {AvatarControl} from '../components/forms/AvatarControl';
import {AvatarPopup as Popup} from '../components/forms/AvatarPopup';
import {RoundButtonLink} from '../components/RoundButtonLink';
import {JSONWrapper} from '../modules/Utils';

const view = new WideLayoutWithSidebar({
  title: 'Профиль',
  Popup, AvatarControl,
  Form, Button, Input, RowLink,
  BackButtonLink: new RoundButtonLink({url: 'chats.html'}),
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
    %{ RowLink({"url": "profile_edit.html", "label": "Изменить данные"}) }%
    %{ RowLink({"url": "profile_newpass.html", "label": "Изменить пароль"}) }%
    %{ RowLink({"url": "auth.html", "label": "Выйти",
                "style": "container__link_danger"}) }%
    <br><br>
  `,
});

export {view};
