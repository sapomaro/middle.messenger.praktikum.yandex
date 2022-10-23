import {Store} from '../modules/Store';
import {Router} from '../modules/Router';
import {EventBus} from '../modules/EventBus';
import {authAPI} from '../api/auth';
import {profileAPI} from '../api/profile';
import {errorHandler} from './errorHandler';

import type {UserT, RequestT, ErrorT} from '../constants/types';

export const profileLoadService = async () => {
  if (!Store.state || !Store.state.user) {
    return new Promise((resolve, reject) => authAPI.getUserData()
    .then(({responseJSON}) => {
      const user: UserT = responseJSON;
      Store.setState({
        user,
        currentError: null,
      });
      resolve(user);
    })
    .catch((error: ErrorT) => {
      reject(errorHandler(error));
      Store.setState({currentError: null});
      Router.redirect('/');
    }));
  }
};

export const profileEditService = async (data: UserT) => {
  profileAPI.editData(data)
  .then(({responseJSON}) => {
    const user: UserT = responseJSON;
    Store.setState({
      user,
      currentError: null,
    });
    Router.navigate('/settings');
  })
  .catch(errorHandler);
};

export const profilePasswordService = async (data: RequestT['ChangePassword']) => {
  profileAPI.changePassword(data)
  .then(() => {
    Store.setState({
      currentError: null,
    });
    Router.navigate('/settings');
  })
  .catch(errorHandler);
};

export const avatarChangeService = async (data: RequestT['ChangeAvatar']) => {
  profileAPI.changeAvatar(data)
  .then(({responseJSON}) => {
    const user: UserT = responseJSON;
    Store.setState({
      user,
      currentError: null,
    });
    EventBus.fire('popupHide');
  })
  .catch(errorHandler);
};
