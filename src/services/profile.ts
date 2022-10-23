import {Store} from '../modules/Store';
import {Router} from '../modules/Router';
import {EventBus} from '../modules/EventBus';
import {profileAPI} from '../api/profile';
import {getUserDataService} from './login';
import {errorHandler} from './errorHandler';

import type {UserT, RequestT, ErrorT} from '../constants/types';

export const profileRedirectService = () => {
  if (Store.state && Store.state.user) {
    setTimeout(() => {
      Router.redirect('/settings');
    }, 1);
  } else {
    getUserDataService()
        .then(() => {
          Router.redirect('/settings');
        })
        .catch(() => null);
  }
};

export const profileLoadService = async () => {
  if (!Store.state || !Store.state.user) {
    return new Promise((resolve, reject) =>
      getUserDataService()
          .then(({responseJSON}) => {
            const user: UserT = responseJSON;
            resolve(user);
          })
          .catch((error: ErrorT) => {
            reject(errorHandler(error));
            Store.setState({currentError: null});
            Router.redirect('/');
          })).catch(() => null); // Класс Ajax надо переписать под промисы...
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

export const profilePasswordService = async (
    data: RequestT['ChangePassword'],
) => {
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
