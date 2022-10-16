export const baseAPIUrl = 'https://ya-praktikum.tech/api/v2/';

export type APIError = {
  reason: string;
};

export type User = {
  id: number;
  login: string;
  first_name: string;
  second_name: string;
  display_name: string;
  avatar: string;
  phone: string;
  email: string;
};
