import {Block} from '../core/Block';
import {Router} from '../core/Router';
import {WideLayout} from '../components/layouts/Wide';
import {ErrorStatusMsg} from '../components/layouts/ErrorStatusMsg';
import {Link} from '../components/links/Link';

const view = new WideLayout({
  title: '500',
  comment: 'Уже фиксим',
  contents: ErrorStatusMsg,
  navLink: new Link({url: '/chats', label: 'Назад к чатам'}),
});

view.on(Block.EVENTS.BEFORERENDER, () => {
  view.updateTitle(Router.getCurrentPathname(true));
});

export {view};
