import {ajax} from '../modules/Ajax';
import {chatsWebSocketUrl} from './base';
import {EventBus} from '../modules/EventBus';
import {JSONWrapper} from '../modules/Utils';

export type AddChatDataType = {
  title: string;
};

export type DeleteChatDataType = {
  chatId: number;
};

export type ChangeUserDataType = {
  users: Array<number>;
  chatId: number;
};

export type ChatDataType = {
  [key: string]: unknown;
  id: number;
  title: string;
  avatar: null | string;
  unread_count: number;
  last_message: null | {
    user: {
      first_name: string;
      second_name: string;
      avatar: string;
      email: string;
      login: string;
      phone: string;
    }
    time: string;
    content: string;
  };
};

export type TextMessage = {
  content: string;
  type: 'message';
};

export const chatsAPI = {
  getChats: () => ajax.get('/chats'),
  addChat: (data: {title: string}) => ajax.post('/chats', data),
  deleteChat: (data: DeleteChatDataType) => ajax.delete('/chats', data),
  getUsersByLogin: (data: {login: string}) => ajax.post('/user/search', data),
  addUsersToChat: (data: ChangeUserDataType) => ajax.put('/chats/users', data),
  deleteUsersFromChat: (data: ChangeUserDataType) =>
    ajax.delete('/chats/users', data),
  getChatToken: (chatId: number) => ajax.post(`/chats/token/${chatId}`),
};

export const chatsSocketAPI: {
  socket: WebSocket | null;
  init: (data: Record<string, string | number>) => void;
  send: (data: TextMessage) => void;
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
