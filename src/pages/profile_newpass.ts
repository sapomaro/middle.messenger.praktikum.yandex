import {WideLayoutWithSidebar} from '../components/layouts/Wide+Side';
import {Form} from '../components/forms/Form';
import {StandardButton as Button} from '../components/buttons/StandardButton';
import {RowInput as Input} from '../components/inputs/RowInput';
import {AvatarControl} from '../components/popups/AvatarControl';
import {Popup} from '../components/popups/Popup';
import {RoundButtonLink} from '../components/buttons/RoundButtonLink';

const view = new WideLayoutWithSidebar({
  title: 'Изменить пароль',
  Form, Button, Input, AvatarControl, Popup,
  aside: new RoundButtonLink({url: '/settings'}),
});

view.props.contents = new Form({
  name: 'changepassword',
  action: 'profile.html',
  fieldset: () => `
    %{ AvatarControl({"unclickable": true}) }%
    %{ Input({
      "label": "Старый пароль", "name": "oldPassword", "type": "password",
      "placeholder": "********"
    }) }%
    %{ Input({
      "label": "Новый пароль", "name": "newPassword", "type": "password",
      "placeholder": "********"
    }) }%
    %{ Input({
      "label": "Повторите новый пароль", "name": "newPassword2",
      "type": "password",
      "placeholder": "********"
    }) }%
    <br><br><br>
    %{ Button({ "name": "submit", "type": "submit", "label": "Сохранить" }) }%
    <br><br>
  `,
});

export {view};
