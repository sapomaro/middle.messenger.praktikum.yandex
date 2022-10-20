import {Store} from '../modules/Store';
import {Router} from '../modules/Router';
import {chatsAPI} from '../api/chats';
import {errorHandler, ErrorType} from './errorHandler';

export const chatsLoadService = async () => {
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
    Router.redirect('/');
  })
  .finally(() => {
    Store.setState({isLoading: false});
  });
};
