import {ajax} from '../modules/Ajax';
import {baseAPIUrl} from './base';

export type LoginDataType = {
  login: string;
  password: string;
};

ajax.baseUrl = baseAPIUrl;

export const authAPI = {
  login: (data: LoginDataType) => ajax.post('auth/signin', data),

  getUserData: () => ajax.get('auth/user'),

  logout: () => ajax.post('auth/logout'),
};
