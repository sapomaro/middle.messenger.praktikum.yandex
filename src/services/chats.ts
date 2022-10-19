import {Store} from '../modules/Store';
import {chatsAPI} from '../api/chats';
import {errorHandler, ErrorType} from './errorHandler';

export const getChatsService = async () => {
  Store.setState({isLoading: true});
  chatsAPI.getChats()
  .then(({responseJSON}) => {
    Store.setState({
      chats: responseJSON,
      currentError: null,
    });
  })
  .catch((error: ErrorType) => {
    errorHandler(error);
    Store.setState({currentError: null});
    Router.navigate('/');
  })
  .finally(() => {
    Store.setState({isLoading: false});
  });
};
