import {ajax} from '../modules/Ajax';
import {baseAPIUrl} from './base';

export type RegDataType = {
  email: string;
  login: string;
  first_name: string;
  second_name: string;
  phone: string;
  password: string;
};

ajax.baseUrl = baseAPIUrl;

export const registerAPI = {
  signup: (data: RegDataType) => ajax.post('auth/signup', data),
};
