import {WideLayout} from '../components/layouts/Wide';
import {ErrorStatusMsg} from '../components/ErrorStatusMsg';

const view = new WideLayout({
  title: '500',
  comment: 'Уже фиксим',
  contents: ErrorStatusMsg,
});

export {view};
