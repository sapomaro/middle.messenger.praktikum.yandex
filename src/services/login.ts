import {Store} from '../modules/Store';
import {Router} from '../modules/Router';
import {authAPI} from '../api/auth';
import {errorHandler} from './errorHandler';

import type {UserT, RequestT} from '../constants/types';

export const getUserDataService = () => {
  return authAPI.getUserData()
      .then(({responseJSON}) => {
        const user: UserT = responseJSON;
        Store.setState({
          user,
          currentError: null,
        });
      })
      .catch(errorHandler);
};

export const loginService = async (data: RequestT['Login']) => {
  Store.setState({isLoading: true});
  authAPI.login(data)
      .then(() => {
        getUserDataService()
            .then(() => {
              Router.navigate('/messenger');
            });
      })
      .catch(errorHandler)
      .finally(() => {
        Store.setState({isLoading: false});
      });
};

export const logoutService = async () => {
  Store.setState({isLoading: true});
  authAPI.logout()
      .catch(errorHandler)
      .finally(() => {
        Store.setState({
          user: null,
          isLoading: false,
          currentError: null,
        });
        Router.navigate('/');
      });
};
