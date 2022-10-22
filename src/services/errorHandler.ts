import type {AjaxState} from '../modules/Ajax';
import {Store} from '../modules/Store';
import {Router} from '../modules/Router';

export type ErrorType = AjaxState | Error;

export const errorHandler = (error: ErrorType) => {
  let currentError = 'Что-то пошло не так...';
  if ('responseJSON' in error && error.responseJSON &&
      typeof error.responseJSON.reason === 'string') {
    currentError = error.responseJSON.reason;
  }
  if ('error' in error && error.error &&
      typeof error.error.message === 'string') {
    currentError = error.error.message;
  }
  if (error instanceof Error) {
    currentError = error.message;
  } else {
    if (typeof error.status === 'number' && error.status >= 500) {
      Router.redirect('/500');
    }
  }
  console.warn(currentError);
  Store.setState({currentError});
  return currentError;
};
