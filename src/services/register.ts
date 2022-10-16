import {Store} from '../modules/Store';
import {Router} from '../modules/Router';
import {registerAPI, RegDataType} from '../api/register';
import {authAPI} from '../api/auth';
import {errorHandler} from './errorHandler';

export {RegDataType};

export const registerService = async (data: RegDataType) => {
  Store.setState({isLoading: true});
  registerAPI.signup(data)
  .then(() => {
    authAPI.getUserData()
    .then(({responseJSON}) => {
      Store.setState({
        user: responseJSON.user,
        currentFormError: null,
      });
console.log(responseJSON.user);
      Router.navigate('/profile');
    })
    .catch(errorHandler);
  })
  .catch(errorHandler)
  .finally(() => {
    Store.setState({isLoading: false});
  });
};
