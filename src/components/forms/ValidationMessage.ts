export const getValidationMessage = ({
    name, value, value2, label
  }: Record<string, string>): string | null => {
  switch (name) {
    case 'login':
    case 'user':
      if (value.length === 0) return `Поле не может быть пустым`;
      if (value.length < 3) return `${label} должен быть больше 3 символов`;
      if (value.length > 20) return `${label} не может быть больше 20 символов`;
      if (/^[0-9_-]+$/.test(value)) {
        return `${label} не может состоять только из цифр или спецсимволов`;
      }
      if (!/^[A-Za-z0-9_-]+$/.test(value)) {
        return `${label} может содержать только латинские буквы, `+
               `цифры, дефис, нижнее подчёркивание`;
      }
      break;

    case 'password':
    case 'oldPassword':
    case 'newPassword':
      if (value.length === 0) return `Поле не может быть пустым`;
      if (value.length < 8) return `${label} должен быть больше 8 символов`;
      if (value.length > 40) return `${label} не может быть больше 40 символов`;
      if (!/[0-9]/.test(value) || value === value.toLowerCase()) {
        return `${label} должен содержать хотя бы одну цифру и заглавную букву`;
      }
      break;

    case 'password2':
    case 'newPassword2':
      if (value.length === 0) return `Поле не может быть пустым`;
      if (typeof value2 !== 'undefined' && value !== value2) {
        return `Пароли не совпадают`;
      }
      break;

    case 'first_name':
    case 'second_name':
      if (value.length === 0) return `Поле не может быть пустым`;
      if (!/^[A-ZА-ЯЁ]/.test(value)) {
        return `Первая буква должна быть заглавной`;
      }
      if (/[0-9 ]/.test(value)) {
        return `${label} не может содержать пробелы или цифры`;
      }
      if (/-$/.test(value)) {
        return `${label} не может оканчиваться дефисом`;
      }
      if (/[А-ЯЁа-яё][А-ЯЁ]/.test(value)) {
        return `Заглавные буквы не могут быть в середине слова`;
      }
      if (!/^[A-ZА-ЯЁ][A-Za-zа-яё]+(-[A-ZА-ЯЁ]?[A-Za-zа-яё]+)*$/.test(value)) {
        return `${label} может содержать только кириллицу/латиницу и дефисы`;
      }
      break;

    case 'email':
      if (value.length === 0) return `Поле не может быть пустым`;
      if (!/[^@\s]+@[^@\s]+\.[^@\s]+/.test(value)) {
        return `Неверная электронная почта`;
      }
      break;

    case 'phone':
      if (value.length === 0) return `Поле не может быть пустым`;
      if (value.length < 10) return `${label} должен быть больше 10 символов`;
      if (value.length > 15) return `${label} не может быть больше 15 символов`;
      if (/ |-/.test(value)) {
        return `${label} не должен содержать пробелы или дефисы`;
      }
      if (!/^\+?[0-9]+$/.test(value)) {
        return `Неверный телефонный номер`;
      }
      break;

    case 'display_name':
      if (value.length === 0) return `Поле не может быть пустым`;
      if (value.length < 3) return `${label} должен быть больше 3 символов`;
      if (value.length > 20) return `${label} не может быть больше 20 символов`;
      break;

    case 'message':
      if (value.length === 0) return `Сообщение не может быть пустым`;
      break;

    default:
      return null;
  }
  return null;
};
