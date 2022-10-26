import {Store} from '../core/Store';
import {Router} from '../core/Router';

import type {ResponseT} from '../constants/types';

export const errorHandler = (error: ResponseT) => {
  let currentError = 'Что-то пошло не так...';
  if ('responseJSON' in error && error.responseJSON &&
      typeof error.responseJSON.reason === 'string') {
    currentError = error.responseJSON.reason;
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
