import {Store} from '../modules/Store';
import {Router} from '../modules/Router';
import {EventBus} from '../modules/EventBus';
import {authAPI} from '../api/auth';
import {profileAPI, ProfileDataType, ProfilePassType,
  AvatarDataType} from '../api/profile';
import {errorHandler, ErrorType} from './errorHandler';

export {ProfileDataType, ProfilePassType, AvatarDataType};

export const profileLoadService = async () => {
  if (!Store.state || !Store.state.user) {
    return new Promise((resolve, reject) => authAPI.getUserData()
    .then(({responseJSON}) => {
      const user: ProfileDataType = responseJSON;
      Store.setState({
        user,
        currentError: null,
      });
      resolve(user);
    })
    .catch((error: ErrorType) => {
      reject(errorHandler(error));
      Store.setState({currentError: null});
      Router.redirect('/');
    }));
  }
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

export const avatarChangeService = async (data: AvatarDataType) => {
  profileAPI.changeAvatar(data)
  .then(({responseJSON}) => {
    const user: ProfileDataType = responseJSON;
    Store.setState({
      user,
      currentError: null,
    });
    EventBus.fire('popupHide');
  })
  .catch(errorHandler);
};
