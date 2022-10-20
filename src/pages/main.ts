import {NarrowLayout} from '../components/layouts/Narrow';
import {MenuLink as Link} from '../components/links/MenuLink';
import {JSONWrapper} from '../modules/Utils';

const view = new NarrowLayout({
  title: 'Карта экранов приложения',
  Link,
});

const links = JSONWrapper.stringify([
  {url: '/', label: 'Вход'},
  {url: '/sing-up', label: 'Регистрация'},
  {url: '/settings', label: 'Профиль'},
  {url: '/settings/edit', label: 'Редактирование профиля'},
  {url: '/settings/password', label: 'Смена пароля'},
  {url: '/messenger', label: 'Чаты'},
  {url: '/404', label: 'Страница 404'},
  {url: '/500', label: 'Страница 500'},
]);

view.props.contents = () => `
  <h1 class="container__header">%{title}%</h1>
  <nav><ul>
    %{ Link(${links}...) }%
  </ul></nav>
`;

export {view};
