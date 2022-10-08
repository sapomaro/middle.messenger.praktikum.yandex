import {WideLayout} from '../components/layouts/Wide';
import {ErrorStatusMsg} from '../components/ErrorStatusMsg';

const view = new WideLayout({
  title: '404',
  comment: 'Не туда попали',
  contents: ErrorStatusMsg,
});

export {view};
