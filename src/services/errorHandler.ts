import {Store} from '../modules/Store';
import {Router} from '../modules/Router';

import type {ErrorT} from '../constants/types';

export const errorHandler = (error: ErrorT) => {
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
