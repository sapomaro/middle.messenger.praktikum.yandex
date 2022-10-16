import {NarrowLayout} from '../components/layouts/Narrow';
import {Form} from '../components/forms/Form';
import {FormError} from '../components/forms/FormError';
import {StandardInput as Input} from '../components/inputs/StandardInput';
import {StandardButton as Button} from '../components/buttons/StandardButton';
import {StandardLink as Link} from '../components/links/StandardLink';

import {StoreSynced} from '../modules/Store';
import {loginService, LoginDataType} from '../services/auth';

const view = new NarrowLayout({
  title: 'Вход',
});

const authForm = new Form({
  name: 'auth',
  action: '/messenger',
  Input, Link,
  formSubmitButton: new (StoreSynced(Button))({
    name: 'submit',
    type: 'submit',
    label: 'Авторизоваться',
    isLoading: false,
  }),
  formError: new (StoreSynced(FormError))({currentFormError: null}),
  fieldset: () => `
    <h1 class="container__header">%{title}%</h1>
    %{ Input({"name": "login", "type": "text", "label": "Логин"}) }%
    %{ Input({"name": "password", "type": "password", "label": "Пароль"}) }%
    <br><br><br>
    %{formSubmitButton}%
    %{formError}%
    %{ Link({"url": "/sing-up", "label": "Нет аккаунта?"}) }%
  `,
});

authForm.on(Form.EVENTS.SUBMIT_SUCCESS, (data: LoginDataType) => {
  loginService(data);
});

view.props.contents = authForm;

export {view};
