import {ChatsLayout} from '../components/layouts/Chats';
import {Form} from '../components/forms/Form';
import {StandardInput as Input} from '../components/forms/StandardInput';
import {StandardButton as Button} from '../components/forms/StandardButton';
import {ChatlistItem} from '../components/chats/ChatlistItem';
import {ChatlistControls} from '../components/chats/ChatlistControls';
import {ChatboxMessage} from '../components/chats/ChatboxMessage';
import {ChatboxHeader} from '../components/chats/ChatboxHeader';
import {ChatboxFooter} from '../components/chats/ChatboxFooter';
import {ChatboxTextarea} from '../components/chats/ChatboxTextarea';
import {JSONWrapper} from '../modules/Utils';

const view = new ChatsLayout({
  title: 'Чаты',
  user: 'Собеседник',
  Form, Input, Button,
  ChatlistItem, ChatlistControls,
  ChatboxMessage, ChatboxHeader, ChatboxFooter, ChatboxTextarea
});

const chats = JSONWrapper.stringify([
  { user: 'Андрей', quote: 'Изображение', when: '10:49', unreads: 2, active: true },
  { user: 'Илья', quote: 'Друзья, у меня для вас особенный выпуск новостей!...', when: '15:12', unreads: 4222 },
  { user: 'Design Destroyer', quote: 'В 2008 году художник Jon Rafman  начал собирать...', when: 'Пн', unreads: 0 },
]);
const messages = JSONWrapper.stringify([
  { type: 'inc', when: '11:56', text: `Привет! Смотри, тут всплыл интересный кусок лунной космической истории — НАСА в какой-то момент попросила Хассельблад адаптировать модель SWC для полетов на Луну. Сейчас мы все знаем что астронавты летали с моделью 500 EL — и к слову говоря, все тушки этих камер все еще находятся на поверхности Луны, так как астронавты с собой забрали только кассеты с пленкой.

Хассельблад в итоге адаптировал SWC для космоса, но что-то пошло не так и на ракету они так никогда и не попали. Всего их было произведено 25 штук, одну из них недавно продали на аукционе за 45000 евро.` },
  { type: 'out', when: '12:00', status: 1, text: 'Круто!' }
]);

view.props.Chatlist = () => `
  %{ ChatlistControls }%
  <ul>
    %{ ChatlistItem(${chats}...) }%
  </ul>
`; 

view.props.ChatboxBody = () => `
  <div class="chatbox__date">19 июня (вс)</div>

  %{ ChatboxMessage(${messages}...) }%
`;

view.props.popup = new Form({
  name: "addUser",
  fieldset: () => `
    <h1 class="container__header">Добавить пользователя</h1>
    <br>
    %{ Input({ "name": "user", "label": "Логин" }) }%
    <br>
    %{ Button({ "name": "add", "type": "submit", "label": "Добавить" }) }%
  `,
});

export {view};
