import {Store} from '../core/Store';
import {Router} from '../core/Router';
import {API} from '../api/GlobalAPI';
import {errorHandler} from './errorHandler';
import {getUserDataService} from './login';

import type {RequestT} from '../constants/types';

export const registerService = async (data: RequestT['Register']) => {
  Store.setState({isLoading: true});
  API.signup(data)
      .then(async () => {
        await getUserDataService();
        Router.navigate('/messenger');
      })
      .catch(errorHandler)
      .finally(() => {
        Store.setState({isLoading: false});
      });
};
