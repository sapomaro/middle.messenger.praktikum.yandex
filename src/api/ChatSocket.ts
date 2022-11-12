import {EventBus} from '../core/EventBus';
import {JSONWrapper} from '../core/Utils';

import type {RequestT, MessageT} from '../constants/types';

const API_CHATS_WEBSOCKET_URL = 'wss://ya-praktikum.tech/ws/chats';

export class ChatSocket {
  private static __instance: ChatSocket;
  private activeSocket: WebSocket | null = null;
  private preventCloseEvent = false;
  constructor() {
    if (ChatSocket.__instance) {
      return ChatSocket.__instance;
    }
    ChatSocket.__instance = this;
  }
  init({userId, chatId, token}: RequestT['SocketInit']) {
    this.shut();
    this.activeSocket =
      new WebSocket(`${API_CHATS_WEBSOCKET_URL}/${userId}/${chatId}/${token}`);
    this.registerEvents();
  }
  shut() {
    if (this.activeSocket) {
      this.preventCloseEvent = true;
      this.activeSocket.close();
      this.activeSocket = null;
    }
  }
  registerEvents() {
    if (this.activeSocket === null) {
      return;
    }
    EventBus.emit('webSocketInit');
    this.activeSocket.addEventListener('open', () => {
      EventBus.emit('webSocketOpen');
    });
    this.activeSocket.addEventListener('close', (event: CloseEvent) => {
      if (!this.preventCloseEvent) {
        EventBus.emit('webSocketClose', event);
      }
      this.preventCloseEvent = false;
    });
    this.activeSocket.addEventListener('message', (event: MessageEvent) => {
      EventBus.emit('webSocketMessage', event.data);
    });
    this.activeSocket.addEventListener('error', (event: ErrorEvent) => {
      EventBus.emit('webSocketError', event);
    });
  }
  send(data: MessageT) {
    if (this.activeSocket &&
        this.activeSocket.readyState !== WebSocket.CLOSED) {
      this.activeSocket.send(JSONWrapper.stringify(data));
    }
  }
}
