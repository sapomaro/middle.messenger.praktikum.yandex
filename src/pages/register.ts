import {NarrowLayout} from '../components/layouts/Narrow';
import {Form} from '../components/forms/Form';
import {StandardInput as Input} from '../components/inputs/StandardInput';
import {StandardButton as Button} from '../components/buttons/StandardButton';
import {StandardLink as Link} from '../components/links/StandardLink';
import {JSONWrapper} from '../modules/Utils';

const view = new NarrowLayout({
  title: 'Регистрация',
  Form, Input, Button, Link,
});

const inputs = JSONWrapper.stringify([
  {name: 'email', type: 'email', label: 'Почта'},
  {name: 'login', type: 'text', label: 'Логин'},
  {name: 'first_name', type: 'text', label: 'Имя'},
  {name: 'second_name', type: 'text', label: 'Фамилия'},
  {name: 'phone', type: 'tel', label: 'Телефон'},
  {name: 'password', type: 'password', label: 'Пароль'},
  {name: 'password2', type: 'password', label: 'Пароль (ещё раз)'},
]);

view.props.contents = new Form({
  name: 'reg',
  action: '/messenger',
  fieldset: () => `
    <h1 class="container__header">%{title}%</h1>
    %{ Input(${inputs}...) }%
    <br><br>
    %{ Button({"name": "submit", "type": "submit",
               "label": "Зарегистрироваться"}) }%
    %{ Link({"url": "/", "label": "Войти"}) }%
  `,
});

export {view};
