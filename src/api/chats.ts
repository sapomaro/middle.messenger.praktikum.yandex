import {ajax} from '../core/Ajax';
import {chatsWebSocketUrl} from './base';
import {EventBus} from '../core/EventBus';
import {JSONWrapper} from '../core/Utils';
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

    EventBus.emit('webSocketInit');

    socket.addEventListener('open', () => {
      EventBus.emit('webSocketOpen');
    });

    socket.addEventListener('close', (event: CloseEvent) => {
      EventBus.emit('webSocketClose', event);
    });

    socket.addEventListener('message', (event: MessageEvent) => {
      EventBus.emit('webSocketMessage', event.data);
    });

    socket.addEventListener('error', (event: ErrorEvent) => {
      EventBus.emit('webSocketError', event);
    });
  },
  send: (data) => {
    const socket = chatsSocketAPI.socket;
    if (socket) {
      socket.send(JSONWrapper.stringify(data));
    }
  },
};
