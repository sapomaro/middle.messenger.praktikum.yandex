import {NarrowLayout} from '../components/layouts/Narrow';
import {Form} from '../components/forms/Form';
import {StandardInput as Input} from '../components/inputs/StandardInput';
import {StandardButton as Button} from '../components/buttons/StandardButton';
import {StandardLink as Link} from '../components/links/StandardLink';

const view = new NarrowLayout({
  title: 'Вход',
});

const authForm = new Form({
  name: 'auth',
  action: '/messenger',
  Input, Button, Link,
  fieldset: () => `
    <h1 class="container__header">%{title}%</h1>
    %{ Input({"name": "login", "type": "text", "label": "Логин"}) }%
    %{ Input({"name": "password", "type": "password", "label": "Пароль"}) }%
    <br><br><br>
    %{ Button({"name": "submit", "type": "submit",
               "label": "Авторизоваться"}) }%
    %{ Link({"url": "/sing-up", "label": "Нет аккаунта?"}) }%
  `,
});

authForm.on(Form.EVENTS.SUBMIT_OK, (data: Record<string, unknown>) => {
  console.log('SUBMIT OK');
  console.log(data);
});

view.props.contents = authForm;

export {view};
