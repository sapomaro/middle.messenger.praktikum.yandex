import {Store} from '../modules/Store';
import {Router} from '../modules/Router';
import {authAPI, LoginDataType} from '../api/auth';

export const loginService = async (data: LoginDataType) => {
  authAPI.login(data)
  .then(({responseJSON}) => {
    console.log(responseJSON);
    Store.setState({currentFormError: null});
    Router.navigate('/messenger');
  })
  .catch(({responseJSON, error, status}) => {
    let currentFormError = '';
    if (responseJSON && responseJSON.reason) {
      currentFormError = responseJSON.reason;
      console.warn(currentFormError);
    } else {
      currentFormError = 'Что-то пошло не так...';
      console.warn(`Status: ${status}`, error);
    }
    Store.setState({currentFormError});
  });
};

export {LoginDataType};
