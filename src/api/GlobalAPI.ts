import {HTTPTransport} from '../core/HTTPTransport';
import type {UserT, RequestT} from '../constants/types';

const API_BASEURL = 'https://ya-praktikum.tech/api/v2';

const http = new HTTPTransport();

http.baseUrl = API_BASEURL;

export const API = {
  getResourceUrl: (pathname: string) =>
    `${API_BASEURL}/resources${pathname}`,
  login: (data: RequestT['Login']) =>
    http.post('/auth/signin', data),
  logout: () =>
    http.post('/auth/logout'),
  signup: (data: RequestT['Register']) =>
    http.post('/auth/signup', data),
  getUserData: () =>
    http.get('/auth/user'),
  editData: (data: UserT) =>
    http.put('/user/profile', data),
  changePassword: (data: RequestT['ChangePassword']) =>
    http.put('/user/password', data),
  changeAvatar: (data: RequestT['ChangeAvatar']) => {
    const formData = new FormData();
    formData.append('avatar', data.avatar);
    return http.put('/user/profile/avatar', formData);
  },
  getChats: () =>
    http.get('/chats'),
  addChat: (data: RequestT['AddChat']) =>
    http.post('/chats', data),
  deleteChat: (data: RequestT['DeleteChat']) =>
    http.delete('/chats', data),
  getUsersByLogin: (data: RequestT['SearchUser']) =>
    http.post('/user/search', data),
  addUsersToChat: (data: RequestT['AddUser']) =>
    http.put('/chats/users', data),
  deleteUsersFromChat: (data: RequestT['DeleteUser']) =>
    http.delete('/chats/users', data),
  getChatToken: (chatId: number) =>
    http.post(`/chats/token/${chatId}`),
};
