import type {AjaxState} from '../modules/Ajax';
import {Store} from '../modules/Store';

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
  }
  Store.setState({currentError});
};
