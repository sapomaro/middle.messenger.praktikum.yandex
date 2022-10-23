import {Store} from '../modules/Store';
import {Router} from '../modules/Router';
import {authAPI} from '../api/auth';
import {errorHandler} from './errorHandler';

import type {RequestT} from '../constants/types';

export const registerService = async (data: RequestT['Register']) => {
  Store.setState({isLoading: true});
  authAPI.signup(data)
  .then(() => {
    authAPI.getUserData()
    .then(({responseJSON}) => {
      Store.setState({
        user: responseJSON.user,
        currentFormError: null,
      });
      Router.navigate('/messenger');
    })
    .catch(errorHandler);
  })
  .catch(errorHandler)
  .finally(() => {
    Store.setState({isLoading: false});
  });
};
