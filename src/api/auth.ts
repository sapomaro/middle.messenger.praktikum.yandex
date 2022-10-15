import {ajax} from '../modules/Ajax';

export type LoginDataType = {
  login: string;
  password: string;
};

export type APIError = {
  reason: string;
};
/*
export type User = {
  id: number;
  login: string;
  first_name: string;
  second_name: string;
  display_name: string;
  avatar: string;
  phone: string;
  email: string;
};

type LoginResponseData = {} | APIError;
*/

ajax.baseUrl = 'https://ya-praktikum.tech/api/v2/';

export const authAPI = {
  login: (data: LoginRequestData) =>
    ajax.post('auth/signin', data),

  getUserData: () => ajax.get('auth/user'),

  logout: () => ajax.post('auth/logout'),
};
