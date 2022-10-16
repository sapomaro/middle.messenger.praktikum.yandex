import {Store} from '../modules/Store';
import {Router} from '../modules/Router';
import {authAPI, LoginDataType} from '../api/auth';
import {errorHandler} from './errorHandler';

export {LoginDataType};

export const loginService = async (data: LoginDataType) => {
  authAPI.login(data)
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
  .catch(errorHandler);
};

export const logoutService = async () => {
  authAPI.logout()
  .catch(errorHandler)
  .finally(() => {
    Store.setState({user: null});
    Router.navigate('/');
  });
};
