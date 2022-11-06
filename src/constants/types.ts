export type PlainObject<T = unknown> = {
  [k in string]: T;
};

export type JSONable = PlainObject | Array<unknown>;

export type Fn = (...args: Array<unknown>) => unknown;

export type StateT = {
  [key: string]: unknown;
  user?: null | UserT,
  chats?: Array<ChatT>;
  activeChatId?: number;
  activeChatToken?: string;
  activeChatMessages?: Array<unknown>;
  isLoading?: boolean;
};

export type UserT = {
  id: number;
  login: string;
  first_name: string;
  second_name: string;
  display_name: string;
  avatar: string;
  phone: string;
  email: string;
};

export type ChatT = {
  [key: string]: unknown;
  id: number;
  title: string;
  avatar: null | string;
  unread_count: number;
  last_message: null | {
    user: UserT;
    time: string;
    content: string;
  };
};

export type MessageT = {
  content?: string;
  type: 'message' | 'get old' | 'ping' | 'pong';
  time?: string;
  user_id?: number;
  id?: number;
};

export type ResponseT = {
  status?: number;
  responseHeaders?: PlainObject;
  responseText?: string;
  responseJSON?: PlainObject;
} | Error;

export type RequestT = {
  Login: {
    login: string;
    password: string;
  };
  Register: {
    login: string;
    password: string;
    email: string;
    phone: string;
    first_name: string;
    second_name: string;
  };
  ChangePassword: {
    oldPassword: string;
    newPassword: string;
  };
  ChangeAvatar: {
    avatar: Blob;
  };
  AddChat: {
    title: string;
  };
  DeleteChat: {
    chatId: number;
  };
  SearchUser: {
    login: string;
  };
  AddUser: {
    users: Array<number>;
    chatId: number;
  };
  DeleteUser: RequestT['AddUser'];
  SendMessage: {
    message: string;
    type?: string;
  };
  SocketInit: {
    userId: number;
    chatId: number;
    token: string;
  };
};
