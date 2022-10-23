import {Store} from '../modules/Store';
import {Router} from '../modules/Router';
import {EventBus} from '../modules/EventBus';
import {chatsAPI} from '../api/chats';
import {errorHandler} from './errorHandler';
import {socketUnloadService} from './chatMessaging';

import type {RequestT, ChatT, ErrorT} from '../constants/types';

let chatAutoloader: ReturnType<typeof setTimeout> | null = null;

const chatsLoadInterval = 15000;

export const chatsUnloadService = () => {
  if (chatAutoloader) {
    clearInterval(chatAutoloader);
  }
  socketUnloadService();
};

export const chatsLoadService = async (callback?: () => void) => {
  Store.setState({isLoading: true});
  chatsAPI.getChats()
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
          clearInterval(chatAutoloader);
        }
        chatAutoloader = setTimeout(() => {
          chatsLoadService();
        }, chatsLoadInterval);
      })
      .catch((error: ErrorT) => {
        errorHandler(error);
        Store.setState({currentError: null});
        Router.redirect('/');
      })
      .finally(() => {
        Store.setState({isLoading: false});
      });
};

export const addChatService = async (data: RequestT['AddChat']) => {
  Store.setState({isLoading: true});
  chatsAPI.addChat(data)
      .then(({responseJSON}) => {
        const chatId = responseJSON.id ?? 0;
        EventBus.fire('popupHide');
        Store.setState({currentError: null, activeChatId: chatId});
        addUserToChatService({login: data.title}, true);
        chatsLoadService(() => {
          Store.state.activeChatId = 0;
          EventBus.fire('chatSelected', chatId);
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
  chatsAPI.deleteChat({chatId})
      .then(() => {
        EventBus.fire('popupHide');
        EventBus.fire('chatSelected', 0);
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
  chatsAPI.getUsersByLogin(data)
      .then(({responseJSON}) => {
        const users = responseJSON;
        if (!(users instanceof Array) || users.length === 0) {
          if (!silent) {
            throw new Error('Пользователь с таким логином не найден');
          }
        } else if (users[0].login === data.login) {
          chatsAPI.addUsersToChat({
            chatId,
            users: [users[0].id ?? 0],
          });
        }
        EventBus.fire('popupHide');
      })
      .catch(errorHandler)
      .finally(() => {
        Store.setState({isLoading: false});
      });
};

export const deleteUserFromChatService = async (data: {login: string}) => {
  Store.setState({isLoading: true});
  const chatId = Store.getState().activeChatId as number;
  chatsAPI.getUsersByLogin(data)
      .then(({responseJSON}) => {
        const users = responseJSON;
        if (!(users instanceof Array) || users.length === 0) {
          throw new Error('Пользователь с таким логином не найден');
        } else if (users[0].login === data.login) {
          chatsAPI.deleteUsersFromChat({
            chatId,
            users: [users[0].id ?? 0],
          });
        }
        EventBus.fire('popupHide');
      })
      .catch(errorHandler)
      .finally(() => {
        Store.setState({isLoading: false});
      });
};
