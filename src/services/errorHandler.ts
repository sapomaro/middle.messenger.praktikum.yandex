import {AjaxState} from '../modules/Ajax';
import {Store} from '../modules/Store';

export const errorHandler = (error: AjaxState | Error) => {
  let currentFormError = '';
  if (error instanceof Error || !error.responseJSON ||
      typeof error.responseJSON.reason !== 'string') {
    currentFormError = 'Что-то пошло не так...';
    console.warn(error);
  } else {
    currentFormError = error.responseJSON.reason;
    console.warn(currentFormError);
  }
  Store.setState({currentFormError});
};
