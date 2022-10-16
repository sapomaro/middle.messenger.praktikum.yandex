import {Store} from '../modules/Store';
import {Router} from '../modules/Router';
import {authAPI, LoginDataType} from '../api/auth';
import type {ProfileDataType} from '../api/profile';
import {errorHandler} from './errorHandler';

export {LoginDataType};

export const loginService = async (data: LoginDataType) => {
  Store.setState({isLoading: true});
  authAPI.login(data)
  .then(() => {
    authAPI.getUserData()
    .then(({responseJSON}) => {
      const user: ProfileDataType = responseJSON;
      Store.setState({
        user,
        currentError: null,
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

export const logoutService = async () => {
  Store.setState({isLoading: true});
  authAPI.logout()
  .catch(errorHandler)
  .finally(() => {
    Store.setState({user: null, isLoading: false});
    Router.navigate('/');
  });
};
