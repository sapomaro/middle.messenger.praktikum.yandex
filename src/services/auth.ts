import {Store} from '../modules/Store';
import {authAPI, LoginDataType} from '../api/auth';

export const loginService = async (data: LoginDataType) => {
  authAPI.login(data)
  .then(({responseJSON}) => {
    console.log(responseJSON);
  })
  .catch(({responseHeaders, responseJSON, error, status}) => {
    console.warn(status, error, responseHeaders);
    if (responseJSON && responseJSON.reason) {
      Store.setState({currentError: responseJSON.reason});
    }
  });

};

export {LoginDataType};