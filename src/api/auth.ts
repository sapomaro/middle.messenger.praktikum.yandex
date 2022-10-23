import {ajax} from '../modules/Ajax';
import {baseAPIUrl} from './base';
import type {RequestT} from '../constants/types';

ajax.baseUrl = baseAPIUrl;

export const authAPI = {
  login: (data: RequestT['Login']) =>
    ajax.post('/auth/signin', data),
  logout: () =>
    ajax.post('/auth/logout'),
  signup: (data: RequestT['Register']) =>
    ajax.post('/auth/signup', data),
  getUserData: () =>
    ajax.get('/auth/user'),
};
