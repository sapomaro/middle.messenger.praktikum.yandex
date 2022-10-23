import {ajax} from '../modules/Ajax';
import {chatsWebSocketUrl} from './base';
import {EventBus} from '../modules/EventBus';
import {JSONWrapper} from '../modules/Utils';
import type {RequestT, MessageT} from '../constants/types';

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

export const chatsSocketAPI: {
  socket: WebSocket | null;
  init: (data: RequestT['SocketInit']) => void;
  send: (data: MessageT) => void;
} = {
  socket: null,
  init: ({userId, chatId, token}) => {
    if (chatsSocketAPI.socket) {
      chatsSocketAPI.socket.close();
    }
    chatsSocketAPI.socket =
      new WebSocket(`${chatsWebSocketUrl}/${userId}/${chatId}/${token}`);
    const socket = chatsSocketAPI.socket;

    EventBus.fire('webSocketInit');

    socket.addEventListener('open', () => {
      EventBus.fire('webSocketOpen');
      console.log('Соединение установлено');
    });

    socket.addEventListener('close', (event: CloseEvent) => {
      EventBus.fire('webSocketClose', event);
      if (event.wasClean) {
        console.log('Соединение закрыто чисто');
      } else {
        console.log('Обрыв соединения');
      }
      console.log(`Код: ${event.code} | Причина: ${event.reason}`);
    });

    socket.addEventListener('message', (event: MessageEvent) => {
      EventBus.fire('webSocketMessage', event.data);
      console.log('Получены данные', event.data);
    });

    socket.addEventListener('error', (event: ErrorEvent) => {
      EventBus.fire('webSocketError', event);
      console.log('Ошибка', event.message);
    });
  },
  send: (data) => {
    const socket = chatsSocketAPI.socket;
    if (socket) {
      socket.send(JSONWrapper.stringify(data));
    }
  },
};
