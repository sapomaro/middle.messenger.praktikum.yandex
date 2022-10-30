import {Store} from '../core/Store';
import {EventBus} from '../core/EventBus';
import {JSONWrapper} from '../core/Utils';
import {API} from '../api/GlobalAPI';
import {ChatSocket} from '../api/ChatSocket';
import {chatsLoadService} from './chatChannels';
import {errorHandler} from './errorHandler';

import type {UserT, RequestT, MessageT} from '../constants/types';

const chatKeepAliveInterval = 30000;
const chatSelectInterval = 1000;
let chatReconnectInterval = 1000;

const getNewReconnectInterval = () => {
  chatReconnectInterval = chatReconnectInterval * 2;
  return chatReconnectInterval;
};

const chatSocket = new ChatSocket();

let connectTimer: ReturnType<typeof setTimeout> | null = null;

export const socketUnloadService = () => {
  if (connectTimer) {
    clearTimeout(connectTimer);
  }
  if (chatKeepAlive) {
    clearInterval(chatKeepAlive);
  }
};

EventBus.on('chatSelected', (chatId: number) => {
  const activeChatId = Store.getState().activeChatId as number;
  if (!chatId || activeChatId === chatId) {
    return;
  }
  Store.setState({activeChatMessages: [], isLoading: true});
  socketUnloadService();
  connectTimer = setTimeout(() => {
    connectToChatService();
  }, chatSelectInterval);
});

export const getChatTokenService = async (chatId: number) => {
  return API.getChatToken(chatId)
      .then(({responseJSON}) => {
        const token = responseJSON.token;
        return token;
      })
      .catch(errorHandler);
};

export const connectToChatService = async () => {
  const user: UserT | null | unknown = Store.getState().user;
  if (!user || !('id' in user) ||
      typeof (user as UserT).id !== 'number') {
    errorHandler(new Error('No user ID'));
    return;
  }
  const userId = (user as UserT).id;
  const chatId = Store.getState().activeChatId as number;
  const token = await getChatTokenService(chatId) as string;
  if (!token) {
    errorHandler(new Error('Token error'));
  }
  chatSocket.init({userId, chatId, token});
};

export const getOldMessagesService = async () => {
  chatSocket.send({content: '0', type: 'get old'});
};

export const sendMessageService = async (data: RequestT['SendMessage']) => {
  chatSocket.send({content: data.message, type: 'message'});
};

let chatKeepAlive: ReturnType<typeof setInterval> | null = null;

EventBus.on('webSocketInit', () => {
  Store.setState({activeChatMessages: [], isLoading: true});
});

EventBus.on('webSocketClose, webSocketError', () => {
  Store.setState({isLoading: true});
  socketUnloadService();
  connectTimer = setTimeout(() => {
    connectToChatService();
  }, getNewReconnectInterval());
});


EventBus.on('webSocketClose', (event: CloseEvent) => {
  if (!event.wasClean) {
    console.warn('webSocketClose',
        `Code: ${event.code||''} | Reason: ${event.reason||''}`);
  }
});
EventBus.on('webSocketError', (event: ErrorEvent) => {
  console.warn('webSocketError', event.message);
});

EventBus.on('webSocketOpen', () => {
  Store.setState({isLoading: false});
  getOldMessagesService();
  chatsLoadService();
  socketUnloadService();
  chatKeepAlive = setInterval(() => {
    chatSocket.send({type: 'ping'});
  }, chatKeepAliveInterval);
});

function msgSort(a: MessageT, b: MessageT) {
  if (a.time && b.time) {
    const timeA = new Date(a.time).getTime();
    const timeB = new Date(b.time).getTime();
    return timeA - timeB;
  }
  return 0;
}

EventBus.on('webSocketMessage', (data: string) => {
  let messages = Store.getState().activeChatMessages as Array<MessageT>;
  if (typeof messages === 'object' && messages instanceof Array) {
    const count = messages.length;
    const parsed = JSONWrapper.parse(data);
    if (parsed instanceof Array) {
      messages.push(...parsed as Array<MessageT>);
      messages = messages.sort(msgSort);
    } else {
      if (parsed.type && parsed.type !== 'pong') {
        messages.push(parsed as MessageT);
      }
    }
    if (count !== messages.length) {
      Store.setState({
        activeChatMessages: messages,
        count: messages.length, // для принудительного обновления стейта
      });
    }
  }
});
