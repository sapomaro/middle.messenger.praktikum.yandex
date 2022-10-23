import {ajax} from '../modules/Ajax';
import {baseAPIUrl} from './base';
import type {UserT, RequestT} from '../constants/types';

ajax.baseUrl = baseAPIUrl;

export const profileAPI = {
  editData: (data: UserT) =>
    ajax.put('/user/profile', data),
  changePassword: (data: RequestT['ChangePassword']) =>
    ajax.put('/user/password', data),
  changeAvatar: (data: RequestT['ChangeAvatar']) => {
    const formData = new FormData();
    formData.append('avatar', data.avatar);
    return ajax.put('/user/profile/avatar', formData);
    // Почему-то выдаёт ошибку 500...
  },
};
