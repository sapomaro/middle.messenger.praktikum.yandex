import {Store} from '../modules/Store';
import {EventBus} from '../modules/EventBus';
import {JSONWrapper} from '../modules/Utils';
import {chatsAPI, chatsSocketAPI} from '../api/chats';
import {chatsLoadService} from './chatChannels';
import {profileLoadService} from './profile';
import {errorHandler} from './errorHandler';

import type {UserT, RequestT} from '../constants/types';

const chatKeepAliveInterval = 30000;
const chatSelectInterval = 1000;
let chatReconnectInterval = 1000;

const getNewReconnectInterval = () => {
  chatReconnectInterval = chatReconnectInterval * 2;
  return chatReconnectInterval;
};

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
  return new Promise((resolve) => chatsAPI.getChatToken(chatId)
      .then(({responseJSON}) => {
        const token = responseJSON.token;
        resolve(token);
      })
      .catch(errorHandler));
};

export const connectToChatService = async () => {
  let user: UserT | null | unknown = Store.getState().user;
  if (!user) {
    user = await profileLoadService();
  }
  if (!user || !('id' in user) ||
      typeof (user as UserT).id !== 'number') {
    try {
      throw new Error('No user ID');
    } catch (error) {
      errorHandler(error);
    }
    return;
  }
  const userId = (user as UserT).id;
  const chatId = Store.getState().activeChatId as number;
  const token = await getChatTokenService(chatId) as string;
  if (!token) {
    try {
      throw new Error('Token error');
    } catch (error) {
      errorHandler(error);
    }
  }
  chatsSocketAPI.init({userId, chatId, token});
};

export const getOldMessagesService = async () => {
  const socket = chatsSocketAPI.socket;
  if (socket && socket.readyState !== WebSocket.CLOSED) {
    chatsSocketAPI.send({content: '0', type: 'get old'});
  }
};

export const sendMessageService = async (data: RequestT['SendMessage']) => {
  const socket = chatsSocketAPI.socket;
  if (socket && socket.readyState !== WebSocket.CLOSED) {
    chatsSocketAPI.send({content: data.message, type: 'message'});
  }
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
  const socket = chatsSocketAPI.socket;
  chatKeepAlive = setInterval(() => {
    if (socket && socket.readyState !== WebSocket.CLOSED) {
      chatsSocketAPI.send({type: 'ping'});
    }
  }, chatKeepAliveInterval);
});

EventBus.on('webSocketMessage', (data: string) => {
  let messages = Store.getState().activeChatMessages;
  if (typeof messages === 'object' && messages instanceof Array) {
    const parsed = JSONWrapper.parse(data);
    if (parsed instanceof Array) {
      messages.push(...parsed);
      messages = messages.sort((a, b) => {
        if (a.time && b.time) {
          const timeA = new Date(a.time).getTime();
          const timeB = new Date(b.time).getTime();
          return timeA - timeB;
        }
        return 0;
      });
    } else {
      messages.push(parsed);
    }
    Store.setState({activeChatMessages: messages});
  }
});
