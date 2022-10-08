import {WideLayout} from '../components/layouts/Wide';
import {Ajax} from '../modules/AjaxService';

const view = new WideLayout({
  title: 'Тест XHR'
});

view.props.contents = () => `
  <h1>%{title}%</h1>
  <h2>Успешный запрос:</h2>
  <textarea>%{result1}%</textarea>
  <h2>Неверный запрос (к несуществующей странице):</h2>
  <textarea>%{result2}%</textarea>
  <p>(выдаст ошибку по таймауту после 2 попыток по 3 секунды)</p>
`;

view.on('mounted', () => {
  Ajax({
    url: 'http://localhost:1234/'
  })
  .then(({response}) => {
    console.log(response);
    view.props.result1 = 'success';
  })
  .catch(({error}) => {
    console.warn(error);
    view.props.result1 = 'error';
  })
  .finally(() => {
    console.log('finally');
    view.props.result1 += ' finally';
    view.refresh();
  });

  Ajax({
    url: 'http://localhost:1235/',
    tries: 2
  })
  .then(({response}) => {
    console.log(response);
    view.props.result2 = 'success';
  })
  .catch(({error}) => {
    console.warn(error);
    view.props.result2 = 'error';
  })
  .finally(() => {
    console.log('finally');
    view.props.result2 += ' finally';
    view.refresh();
  });
});

export {view};
