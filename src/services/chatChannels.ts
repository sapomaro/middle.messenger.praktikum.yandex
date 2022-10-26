import {Store} from '../core/Store';
import {Router} from '../core/Router';
import {EventBus} from '../core/EventBus';
import {API} from '../api/GlobalAPI';
import {errorHandler} from './errorHandler';
import {socketUnloadService} from './chatMessaging';

import type {RequestT, ChatT, ErrorT} from '../constants/types';

const chatsLoadInterval = 15000;

let chatAutoloader: ReturnType<typeof setTimeout> | null = null;

export const chatsUnloadService = () => {
  if (chatAutoloader) {
    clearTimeout(chatAutoloader);
  }
  socketUnloadService();
};

export const chatsLoadService = async (callback?: () => void) => {
  Store.setState({isLoading: true});
  API.getChats()
      .then(({responseJSON}) => {
        let chats: Array<ChatT> = responseJSON;
        chats = chats.sort((a, b) => {
          let timeA = 0;
          let timeB = 0;
          if (a.last_message === null || !a.last_message?.time) {
            timeA = new Date().getTime();
          } else {
            timeA = new Date(a.last_message.time).getTime();
          }
          if (b.last_message === null || !b.last_message?.time) {
            timeB = new Date().getTime();
          } else {
            timeB = new Date(b.last_message.time).getTime();
          }
          return timeB - timeA;
        });
        Store.setState({
          chats,
          currentError: null,
        });
        if (typeof callback === 'function') {
          callback();
        }
        if (chatAutoloader) {
          clearTimeout(chatAutoloader);
        }
        chatAutoloader = setTimeout(() => {
          chatsLoadService();
        }, chatsLoadInterval);
      })
      .catch((error: ErrorT) => {
        errorHandler(error);
        Store.setState({user: null, currentError: null});
        Router.redirect('/');
      })
      .finally(() => {
        Store.setState({isLoading: false});
      });
};

export const addChatService = async (data: RequestT['AddChat']) => {
  Store.setState({isLoading: true});
  API.addChat(data)
      .then(({responseJSON}) => {
        const chatId = responseJSON.id ?? 0;
        EventBus.emit('popupHide');
        Store.setState({currentError: null, activeChatId: chatId});
        addUserToChatService({login: data.title}, true);
        chatsLoadService(() => {
          Store.state.activeChatId = 0;
          EventBus.emit('chatSelected', chatId);
          Store.state.activeChatId = chatId;
        });
      })
      .catch(errorHandler)
      .finally(() => {
        Store.setState({isLoading: false});
      });
};

export const deleteChatService = async () => {
  Store.setState({isLoading: true});
  chatsUnloadService();
  const chatId = Store.getState().activeChatId as number;
  API.deleteChat({chatId})
      .then(() => {
        EventBus.emit('popupHide');
        EventBus.emit('chatSelected', 0);
        Store.setState({activeChatId: 0});
        chatsLoadService();
      })
      .catch(errorHandler)
      .finally(() => {
        Store.setState({isLoading: false});
      });
};

export const addUserToChatService = async (data: {login: string},
    silent = false) => {
  Store.setState({isLoading: true});
  const chatId = Store.getState().activeChatId as number;
  API.getUsersByLogin(data)
      .then(({responseJSON}) => {
        const users = responseJSON;
        if (!(users instanceof Array) || users.length === 0) {
          if (!silent) {
            throw new Error('Пользователь с таким логином не найден');
          }
        } else if (users[0].login === data.login) {
          API.addUsersToChat({
            chatId,
            users: [users[0].id ?? 0],
          });
        }
        EventBus.emit('popupHide');
      })
      .catch(errorHandler)
      .finally(() => {
        Store.setState({isLoading: false});
      });
};

export const deleteUserFromChatService = async (data: {login: string}) => {
  Store.setState({isLoading: true});
  const chatId = Store.getState().activeChatId as number;
  API.getUsersByLogin(data)
      .then(({responseJSON}) => {
        const users = responseJSON;
        if (!(users instanceof Array) || users.length === 0) {
          throw new Error('Пользователь с таким логином не найден');
        } else if (users[0].login === data.login) {
          API.deleteUsersFromChat({
            chatId,
            users: [users[0].id ?? 0],
          });
        }
        EventBus.emit('popupHide');
      })
      .catch(errorHandler)
      .finally(() => {
        Store.setState({isLoading: false});
      });
};
