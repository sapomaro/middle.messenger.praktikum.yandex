import {NarrowLayout} from '../components/layouts/Narrow';
import {Form} from '../components/forms/Form';
import {FormError} from '../components/forms/FormError';
import {StandardInput as Input} from '../components/inputs/StandardInput';
import {StandardButton as Button} from '../components/buttons/StandardButton';
import {StandardLink as Link} from '../components/links/StandardLink';
import {JSONWrapper} from '../modules/Utils';

import {StoreSynced} from '../modules/Store';
import {registerService, RegDataType} from '../services/register';

const view = new NarrowLayout({
  title: 'Регистрация',
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

const regForm = new Form({
  name: 'reg',
  Input, Link,
  formSubmitButton: new (StoreSynced(Button))({
    name: 'submit',
    type: 'submit',
    label: 'Зарегистрироваться',
    isLoading: false,
  }),
  formError: new (StoreSynced(FormError))({currentFormError: null}),
  fieldset: () => `
    <h1 class="container__header">%{title}%</h1>
    %{ Input(${inputs}...) }%
    <br><br>
    %{formSubmitButton}%
    %{formError}%
    %{ Link({"url": "/", "label": "Войти"}) }%
  `,
});

regForm.on(Form.EVENTS.SUBMIT_SUCCESS, (data: RegDataType) => {
  registerService(data);
});

view.props.contents = regForm;

export {view};
