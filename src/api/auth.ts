import {ajax} from '../modules/Ajax';
import {baseAPIUrl, APIError} from './base';

export {APIError};

export type LoginDataType = {
  login: string;
  password: string;
};

//type LoginResponseData = {} | APIError;

ajax.baseUrl = baseAPIUrl;

export const authAPI = {
  login: (data: LoginDataType) => ajax.post('auth/signin', data),

  getUserData: () => ajax.get('auth/user'),

  logout: () => ajax.post('auth/logout'),
};
