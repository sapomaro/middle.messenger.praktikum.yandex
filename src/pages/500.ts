import {WideLayout} from '../components/layouts/Wide';
import {ErrorStatusMsg} from '../components/layouts/ErrorStatusMsg';
import {Link} from '../components/links/Link';

const view = new WideLayout({
  title: '500',
  comment: 'Уже фиксим',
  contents: ErrorStatusMsg,
  navLink: new Link({url: '/messenger', label: 'Назад к чатам'}),
});

export {view};
