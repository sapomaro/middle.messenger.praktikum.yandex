import {NarrowLayout} from '../components/layouts/Narrow';
import {Block} from '../core/Block';
import {Form} from '../components/forms/Form';
import {FormError} from '../components/forms/FormError';
import {StandardInput as Input} from '../components/inputs/StandardInput';
import {StandardButton as Button} from '../components/buttons/StandardButton';
import {StandardLink as Link} from '../components/links/StandardLink';

import {StoreSynced} from '../core/Store';
import {loginService} from '../services/login';
import {profileRedirectService} from '../services/profile';

import type {RequestT} from '../constants/types';

const view = new NarrowLayout({
  title: 'Вход',
});

view.on(Block.EVENTS.BEFORERENDER, profileRedirectService);

const authForm = new Form({
  name: 'auth',
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
    %{formSubmitButton}%
    %{formError}%
    %{ Link({"url": "/sing-up", "label": "Нет аккаунта?"}) }%
  `,
});

authForm.on(Form.EVENTS.SUBMIT_SUCCESS, (data: RequestT['Login']) => {
  loginService(data);
});

view.props.contents = authForm;

export {view};
