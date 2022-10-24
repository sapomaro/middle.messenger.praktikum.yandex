import {EventBus} from '../modules/EventBus';
import {JSONWrapper} from '../modules/Utils';
import {chatsWebSocketUrl} from './base';

import type {RequestT, MessageT} from '../constants/types';

export class ChatSocket {
  static __instance: ChatSocket;
  private activeSocket: WebSocket | null = null;
  constructor() {
    if (ChatSocket.__instance) {
      return ChatSocket.__instance;
    }
    ChatSocket.__instance = this;
  }
  init({userId, chatId, token}: RequestT['SocketInit']) {
    if (this.activeSocket) {
      this.activeSocket.close();
      this.activeSocket = null;
    }
    this.activeSocket =
      new WebSocket(`${chatsWebSocketUrl}/${userId}/${chatId}/${token}`);
    this.registerEvents();
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
      EventBus.emit('webSocketClose', event);
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
