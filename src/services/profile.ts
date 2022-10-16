import {Store} from '../modules/Store';
import {Router} from '../modules/Router';
import {authAPI} from '../api/auth';
import {profileAPI, ProfileDataType, ProfilePassType} from '../api/profile';
import {errorHandler, ErrorType} from './errorHandler';

export {ProfileDataType, ProfilePassType};

export const profileLoadService = async () => {
  authAPI.getUserData()
  .then(({responseJSON}) => {
    const user: ProfileDataType = responseJSON;
    Store.setState({
      user,
      currentError: null,
    });
  })
  .catch((error: ErrorType) => {
    errorHandler(error);
    Store.setState({currentError: null});
    Router.navigate('/');
  });
};

export const profileEditService = async (data: ProfileDataType) => {
  profileAPI.editData(data)
  .then(({responseJSON}) => {
    const user: ProfileDataType = responseJSON;
    Store.setState({
      user,
      currentError: null,
    });
    Router.navigate('/settings');
  })
  .catch(errorHandler);
};

export const profilePasswordService = async (data: ProfilePassType) => {
  profileAPI.changePassword(data)
  .then(() => {
    Store.setState({
      currentError: null,
    });
    Router.navigate('/settings');
  })
  .catch(errorHandler);
};
