import type {AjaxState} from '../modules/Ajax';
import {Store} from '../modules/Store';
import {Router} from '../modules/Router';

export type ErrorType = AjaxState | Error;

export const errorHandler = (error: ErrorType) => {
  let currentError = '';
  if (error instanceof Error || !error.responseJSON ||
      typeof error.responseJSON.reason !== 'string') {
    currentError = 'Что-то пошло не так...';
    console.warn(error);
  } else {
    currentError = error.responseJSON.reason;
    console.warn(currentError);
    if (typeof error.status === 'number' && error.status >= 500) {
      Router.redirect('/500');
    }
  }
  Store.setState({currentError});
};
