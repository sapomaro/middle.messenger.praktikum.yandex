import {WideLayout} from '../components/layouts/Wide';
import {ErrorStatusMsg} from '../components/ErrorStatusMsg';
import {Link} from '../components/Link';

const view = new WideLayout({
  title: '500',
  comment: 'Уже фиксим',
  contents: ErrorStatusMsg,
  navLink: new Link({url: '/messenger', label: 'Назад к чатам'}),
});

export {view};
