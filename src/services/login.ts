import {Store} from '../core/Store';
import {Router} from '../core/Router';
import {EventBus} from '../core/EventBus';
import {API} from '../api/GlobalAPI';
import {errorHandler} from './errorHandler';

import type {UserT, RequestT} from '../constants/types';

export const authControlService = async () => {
  Store.setState({isLoading: true});
  let authed = false;
  if (Store.state.user) {
    authed = true;
  } else {
    setTimeout(() => EventBus.emit('popupShow', 'LoadPopup'), 1);
    await getUserDataService(true);
    if (Store.state.user) {
      authed = true;
    }
  }
  let redirectRoute: string | null = null;
  if (authed) {
    if (Router.currentRoute === '/' ||
        Router.currentRoute === '/sing-up') {
      redirectRoute = '/messenger';
    }
  } else {
    if (Router.currentRoute === '/settings' ||
        Router.currentRoute === '/settings/edit' ||
        Router.currentRoute === '/settings/password' ||
        Router.currentRoute === '/messenger') {
      redirectRoute = '/';
    }
  }
  setTimeout(() => {
    Store.setState({isLoading: false, currentError: null});
    if (redirectRoute) Router.redirect(redirectRoute);
    EventBus.emit('popupHide');
  }, 500);
};

export const getUserDataService = async (silent = false) => {
  return await API.getUserData()
      .then(({responseJSON}) => {
        const user: UserT = responseJSON;
        Store.setState({
          user,
          currentError: null,
        });
      })
      .catch((error: Error) => {
        if (!silent) {
          errorHandler(error);
        }
      });
};

export const loginService = async (data: RequestT['Login']) => {
  Store.setState({isLoading: true});
  API.login(data)
      .then(async () => {
        await getUserDataService();
        Router.navigate('/messenger');
      })
      .catch(errorHandler)
      .finally(() => {
        Store.setState({isLoading: false});
      });
};

export const logoutService = async () => {
  Store.setState({isLoading: true});
  API.logout()
      .catch(errorHandler)
      .finally(() => {
        Store.setState({
          user: null,
          isLoading: false,
          currentError: null,
        });
        Router.navigate('/');
      });
};
