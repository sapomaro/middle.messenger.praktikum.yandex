import {NarrowLayout} from '../components/layouts/Narrow';
import {Form} from '../components/forms/Form';
import {StandardInput as Input} from '../components/forms/StandardInput';
import {StandardButton as Button} from '../components/forms/StandardButton';
import {StandardLink as Link} from '../components/forms/StandardLink';

const view = new NarrowLayout({
  title: 'Вход',
  Form, Input, Button, Link,
});

view.props.contents = `%{ Form({ "name": "auth", "action": "chats.html" }) }%`;

view.props.fieldset = () => `
  <h1 class="container__header">%{title}%</h1>
  %{ Input({"name": "login", "type": "text", "label": "Логин"}) }%
  %{ Input({"name": "password", "type": "password", "label": "Пароль"}) }%
  <br><br><br>
  %{ Button({"name": "submit", "type": "submit",
             "label": "Авторизоваться"}) }%
  %{ Link({"url": "register.html", "label": "Нет аккаунта?"}) }%
`;

export {view};
