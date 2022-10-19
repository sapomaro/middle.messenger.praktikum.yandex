import {ajax} from '../modules/Ajax';
import {baseAPIUrl} from './base';

export type ProfileDataType = {
  id: number;
  login: string;
  first_name: string;
  second_name: string;
  display_name: string;
  avatar: string;
  phone: string;
  email: string;
};

export type ProfilePassType = {
  oldPassword: string;
  newPassword: string;
};

export type AvatarDataType = {
  avatar: Blob;
};

ajax.baseUrl = baseAPIUrl;

export const profileAPI = {
  editData: (data: ProfileDataType) => ajax.put('/user/profile', data),
  changePassword: (data: ProfilePassType) => ajax.put('/user/password', data),
  changeAvatar: (data: AvatarDataType) => {
    const formData = new FormData();
    formData.append('avatar', data.avatar);
    return ajax.put('/user/profile/avatar', formData);
  },
};
