import {Store} from '../modules/Store';
import {EventBus} from '../modules/EventBus';
import {JSONWrapper} from '../modules/Utils';
import {chatsAPI, chatsSocketAPI} from '../api/chats';
import {profileLoadService} from './profile';
import {errorHandler} from './errorHandler';

import type {UserT} from '../constants/types';

let chatSelectedTimer: ReturnType<typeof setTimeout> | null = null;
EventBus.on('chatSelected', (chatId: number) => {
  Store.setState({isLoading: true});
  if (chatSelectedTimer) {
    clearTimeout(chatSelectedTimer);
  }
  chatSelectedTimer = setTimeout(() => {
    if (chatId) {
      connectToChatService();
    }
  }, 500);
});

export const getChatTokenService = async (chatId: number) => {
  return new Promise((resolve) => chatsAPI.getChatToken(chatId)
  .then(({responseJSON}) => {
    const token = responseJSON.token;
    Store.setState({activeChatToken: token});
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
    }
    catch (error) {
      errorHandler(error);
    }
    return;
  }
  const userId = (user as UserT).id;
  const chatId = Store.getState().activeChatId as number;
  let token = Store.getState().activeChatToken as string;
  if (!token) {
    token = await getChatTokenService(chatId);
  }
  chatsSocketAPI.init({userId, chatId, token});
}

export const sendMessageService = async (data: {message: string}) => {
  const socket = chatsSocketAPI.socket;
  if (socket && socket.readyState !== WebSocket.CLOSED) {
    chatsSocketAPI.send({content: data.message, type: 'message'});
  }
};
EventBus.on('webSocketInit', () => {
  Store.setState({activeChatMessages: [], isLoading: true});
});
EventBus.on('webSocketClose, webSocketError', () => {
  Store.setState({isLoading: true});
});
EventBus.on('webSocketOpen', () => {
  Store.setState({isLoading: false});
});
EventBus.on('webSocketMessage', (data: string) => {
  const messages = Store.getState().activeChatMessages;
  if (typeof messages === 'object' && messages instanceof Array) {
    messages.push(JSONWrapper.parse(data));
    Store.setState({activeChatMessages: messages});
  }
});
