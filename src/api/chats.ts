import {ajax} from '../modules/Ajax';
import {chatsWebSocketUrl} from './base';

export type AddChatDataType = {
  title: string;
};

export type DeleteChatDataType = {
  chatId: number;
};

export type AddUserDataType = {
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

export const chatsAPI = {
  getChats: () => ajax.get('/chats'),
  addChat: (data: {title: string}) => ajax.post('/chats', data),
  deleteChat: (data: DeleteChatDataType) => ajax.delete('/chats', data),
  getUsersByLogin: (data: {login: string}) => ajax.post('/user/search', data),
  addUsersToChat: (data: AddUserDataType) => ajax.put('/chats/users', data),
};

const chatsSocketAPI = ({userId, chatId, token}: Record<string, string>) => {
  const socket = new WebSocket(`${chatsWebSocketUrl}/${userId}/${chatId}/${token}`); 

  socket.addEventListener('open', () => {
    console.log('Соединение установлено');
    socket.send(JSON.stringify({
      content: 'Моё первое сообщение миру!',
      type: 'message',
    }));
  });

  socket.addEventListener('close', (event: CloseEvent) => {
    if (event.wasClean) {
      console.log('Соединение закрыто чисто');
    } else {
      console.log('Обрыв соединения');
    }
    console.log(`Код: ${event.code} | Причина: ${event.reason}`);
  });

  socket.addEventListener('message', (event: MessageEvent) => {
    console.log('Получены данные', event.data);
  });

  socket.addEventListener('error', (event: ErrorEvent) => {
    console.log('Ошибка', event.message);
  });
}
