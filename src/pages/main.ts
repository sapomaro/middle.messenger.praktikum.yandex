import {NarrowLayout} from '../components/layouts/Narrow';
import {MenuLink as Link} from '../components/MenuLink';
import {JSONWrapper} from '../modules/Utils';

const view = new NarrowLayout({
  title: 'Карта экранов приложения',
  Link,
});

const links = JSONWrapper.stringify([
  {url: 'auth.html', label: 'Вход'},
  {url: 'register.html', label: 'Регистрация'},
  {url: 'profile.html', label: 'Профиль'},
  {url: 'profile_edit.html', label: 'Редактирование профиля'},
  {url: 'profile_newpass.html', label: 'Смена пароля'},
  {url: 'chats.html', label: 'Чаты'},
  {url: '404.html', label: 'Страница 404'},
  {url: '500.html', label: 'Страница 500'},
  {url: 'test.html', label: 'Тест XHR'},
]);

view.props.contents = () => `
  <h1 class="container__header">%{title}%</h1>
  <nav><ul>
    %{ Link(${links}...) }%
  </ul></nav>
`;

export {view};
