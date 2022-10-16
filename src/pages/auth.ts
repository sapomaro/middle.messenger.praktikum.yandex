import {NarrowLayout} from '../components/layouts/Narrow';
import {Form} from '../components/forms/Form';
import {FormError} from '../components/forms/FormError';
import {StandardInput as Input} from '../components/inputs/StandardInput';
import {StandardButton as Button} from '../components/buttons/StandardButton';
import {StandardLink as Link} from '../components/links/StandardLink';

import {Store} from '../modules/Store';
import {loginService, LoginDataType} from '../services/auth';

const view = new NarrowLayout({
  title: 'Вход',
});

const authForm = new Form({
  name: 'auth',
  action: '/messenger',
  Input, Button, Link,
  formError: new FormError(),
  fieldset: () => `
    <h1 class="container__header">%{title}%</h1>
    %{ Input({"name": "login", "type": "text", "label": "Логин"}) }%
    %{ Input({"name": "password", "type": "password", "label": "Пароль"}) }%
    <br><br><br>
    %{ Button({"name": "submit", "type": "submit",
               "label": "Авторизоваться"}) }%
    %{formError}%
    %{ Link({"url": "/sing-up", "label": "Нет аккаунта?"}) }%
  `,
});

Store.on('load', () => {
  console.log('Store loaded');
});

authForm.on(Form.EVENTS.SUBMIT_OK, (data: LoginDataType) => {
  console.log('SUBMIT OK');
  console.log(data);
  loginService(data);
});

view.props.contents = authForm;

export {view};
