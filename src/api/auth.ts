import {ajax} from '../modules/Ajax';
import {baseAPIUrl} from './base';

export type LoginDataType = {
  login: string;
  password: string;
};

export type RegDataType = {
  email: string;
  login: string;
  first_name: string;
  second_name: string;
  phone: string;
  password: string;
};

ajax.baseUrl = baseAPIUrl;

export const authAPI = {
  login: (data: LoginDataType) => ajax.post('/auth/signin', data),
  logout: () => ajax.post('/auth/logout'),
  signup: (data: RegDataType) => ajax.post('/auth/signup', data),
  getUserData: () => ajax.get('/auth/user'),
};
