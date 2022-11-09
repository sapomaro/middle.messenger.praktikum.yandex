import {Store} from '../core/Store';
import {Router} from '../core/Router';
import {EventBus} from '../core/EventBus';
import {API} from '../api/GlobalAPI';
import {errorHandler} from './errorHandler';

import type {UserT, RequestT} from '../constants/types';

export const profileEditService = async (data: UserT) => {
  API.editData(data)
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
  API.changePassword(data)
      .then(() => {
        Store.setState({
          currentError: null,
        });
        Router.navigate('/settings');
      })
      .catch(errorHandler);
};

export const avatarChangeService = async (_: RequestT['ChangeAvatar'],
    formData: FormData) => {
  API.changeAvatar(formData)
      .then(({responseJSON}) => {
        const user: UserT = responseJSON;
        Store.setState({
          user,
          currentError: null,
        });
        EventBus.emit('popupHide');
      })
      .catch(errorHandler);
};
