import {ajax} from '../modules/Ajax';
import {baseAPIUrl, chatsWebSocketUrl} from './base';

export const chatsAPI = {
  getChats: () => ajax.get('/chats'),

};


const chatsSocketAPI = ({userId, chatId, token}) => {
  const socket = new WebSocket(`${chatsWebSocketUrl}/${userId}/${chatId}/${token}`); 

  socket.addEventListener('open', () => {
    console.log('Соединение установлено');
    socket.send(JSON.stringify({
      content: 'Моё первое сообщение миру!',
      type: 'message',
    }));
  });

  socket.addEventListener('close', event => {
    if (event.wasClean) {
      console.log('Соединение закрыто чисто');
    } else {
      console.log('Обрыв соединения');
    }
    console.log(`Код: ${event.code} | Причина: ${event.reason}`);
  });

  socket.addEventListener('message', event => {
    console.log('Получены данные', event.data);
  });

  socket.addEventListener('error', event => {
    console.log('Ошибка', event.message);
  });
}
