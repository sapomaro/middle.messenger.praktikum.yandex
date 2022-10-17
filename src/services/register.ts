import {Store} from '../modules/Store';
import {Router} from '../modules/Router';
import {authAPI, RegDataType} from '../api/auth';
import {errorHandler} from './errorHandler';

export {RegDataType};

export const registerService = async (data: RegDataType) => {
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
