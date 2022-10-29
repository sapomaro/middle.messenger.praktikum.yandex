import {WideLayout} from '../components/layouts/Wide';
import {ErrorStatusMsg} from '../components/layouts/ErrorStatusMsg';
import {Link} from '../components/links/Link';

const view = new WideLayout({
  title: '404',
  comment: 'Не туда попали',
  contents: ErrorStatusMsg,
  navLink: new Link({url: '/messenger', label: 'Назад к чатам'}),
});

export {view};
