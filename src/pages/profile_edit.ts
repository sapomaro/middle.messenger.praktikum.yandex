import {WideLayoutWithSidebar} from '../components/layouts/Wide+Side';
import {Form} from '../components/forms/Form';
import {StandardButton as Button} from '../components/forms/StandardButton';
import {RowInput as Input} from '../components/forms/RowInput';
import {RowLink as Link} from '../components/forms/RowLink';
import {AvatarControl} from '../components/forms/AvatarControl';
import {Popup} from '../components/Popup';
import {RoundButtonLink} from '../components/RoundButtonLink';
import {JSONWrapper} from '../modules/Utils';

const view = new WideLayoutWithSidebar({
  title: 'Изменить данные',
  Form, Button, Input, Link, AvatarControl, Popup,
});

view.props.contents = `%{ Form({ "name": "profile", "action": "" }) }%`;

view.props.BackButtonLink = new RoundButtonLink({url: 'profile.html'});

const userData: Record<string, string> = {
  email: 'pochta@yandex.ru',
  login: 'ivanovivan',
  first_name: 'Иван',
  second_name: 'Иванов',
  display_name: 'Ivan Ivanov',
  phone: '+7-777-777-7777',
};

const inputsData: Array<Record<string, string>> = [
  {name: 'email', type: 'email', label: 'Почта'},
  {name: 'login', type: 'text', label: 'Логин'},
  {name: 'first_name', type: 'text', label: 'Имя'},
  {name: 'second_name', type: 'text', label: 'Фамилия'},
  {name: 'display_name', type: 'text', label: 'Имя в чате'},
  {name: 'phone', type: 'tel', label: 'Телефон'},
];

for (const input of inputsData) {
  input.value = userData[input.name];
}

const inputs = JSONWrapper.stringify(inputsData);

view.props.fieldset = () => `
  %{ AvatarControl({"unclickable": true}) }%
  %{ Input(${inputs}...) }%
  <br><br><br>
  %{ Button({ "name": "submit", "type": "submit", "label": "Сохранить" }) }%
  <br><br>
`;

export {view};
