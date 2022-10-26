import {ajax} from '../core/Ajax';
import type {RequestT} from '../constants/types';

export const chatsAPI = {
  getChats: () =>
    ajax.get('/chats'),
  addChat: (data: RequestT['AddChat']) =>
    ajax.post('/chats', data),
  deleteChat: (data: RequestT['DeleteChat']) =>
    ajax.delete('/chats', data),
  getUsersByLogin: (data: RequestT['SearchUser']) =>
    ajax.post('/user/search', data),
  addUsersToChat: (data: RequestT['AddUser']) =>
    ajax.put('/chats/users', data),
  deleteUsersFromChat: (data: RequestT['DeleteUser']) =>
    ajax.delete('/chats/users', data),
  getChatToken: (chatId: number) =>
    ajax.post(`/chats/token/${chatId}`),
};
