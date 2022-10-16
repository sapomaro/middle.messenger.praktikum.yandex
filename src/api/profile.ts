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

ajax.baseUrl = baseAPIUrl;

export const profileAPI = {
  editData: (data: ProfileDataType) => ajax.put('user/profile', data),
  changePassword: (data: ProfilePassType) => ajax.put('user/password', data),
};
