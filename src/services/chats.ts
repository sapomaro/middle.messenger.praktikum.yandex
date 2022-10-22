import {Store} from '../modules/Store';
import {Router} from '../modules/Router';
import {EventBus} from '../modules/EventBus';
import {chatsAPI, chatsSocketAPI,
  AddChatDataType, ChatDataType} from '../api/chats';
import {profileLoadService, ProfileDataType} from './profile';
import {errorHandler, ErrorType} from './errorHandler';

export {AddChatDataType, ChatDataType};

export const chatsLoadService = async (callback?: () => void) => {
  Store.setState({isLoading: true});
  chatsAPI.getChats()
  .then(({responseJSON}) => {
    Store.setState({
      chats: responseJSON,
      currentError: null,
    });
    if (typeof callback === 'function') {
      callback();
    }
  })
  .catch((error: ErrorType) => {
    errorHandler(error);
    Store.setState({currentError: null});
    Router.redirect('/');
  })
  .finally(() => {
    Store.setState({isLoading: false});
  });
};

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

export const connectToChatService = async () => {
  let user: ProfileDataType | null | unknown = Store.getState().user;
  if (!user) {
    user = await profileLoadService();
  }
  if (!user || !('id' in user) ||
      typeof (user as ProfileDataType).id !== 'number') {
    try {
      throw new Error('No user ID');
    }
    catch (error) {
      errorHandler(error);
    }
    return;
  }
  const userId = (user as ProfileDataType).id;
  const chatId = Store.getState().activeChatId as number;
  chatsAPI.getChatToken(chatId)
  .then(({responseJSON}) => {
    const token = responseJSON.token;
    Store.setState({activeChatToken: token});
    chatsSocketAPI.init({userId, chatId, token});
  })
  .catch(errorHandler)
  .finally(() => {
    Store.setState({isLoading: false});
  });
}

export const sendMessageService = async (data: {message: string}) => {
  const socket = chatsSocketAPI.socket;
  if (socket && socket.readyState !== WebSocket.CLOSED) {
    chatsSocketAPI.send({content: data.message, type: 'message'});
  }
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
    } else if(users[0].login === data.login) {
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
    } else if(users[0].login === data.login) {
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

export const addChatService = async (data: AddChatDataType) => {
  Store.setState({isLoading: true});
  chatsAPI.addChat(data)
  .then(({responseJSON}) => {
    const chatId = responseJSON.id ?? 0;
    EventBus.fire('popupHide');
    Store.setState({currentError: null, activeChatId: chatId});
    addUserToChatService({login: data.title}, true);
    chatsLoadService(() => {
      EventBus.fire('chatSelected', chatId);
    });
  })
  .catch(errorHandler)
  .finally(() => {
    Store.setState({isLoading: false});
  });
};

export const deleteChatService = async () => {
  Store.setState({isLoading: true});
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
