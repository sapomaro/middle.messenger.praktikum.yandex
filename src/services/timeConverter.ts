const weekdays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const months = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн',
  'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
const getTimeObj = (time?: string) => {
  const date = (time? new Date(time) : new Date());
  return {
    year: date.getFullYear(),
    month: months[date.getMonth()],
    day: date.getDate(),
    weekday: weekdays[date.getDay()],
    hour: date.getHours(),
    min: date.getMinutes(),
  };
};

export const timeConverter = (time?: string) => {
  if (!time) {
    return '';
  }
  const current = getTimeObj();
  const past = getTimeObj(time);

  if (current.year !== past.year) {
    return `${past.day} ${past.month} ${past.year} г.`;
  }
  const difference = current.day - past.day;
  if (current.month !== past.month || difference > 6) {
    return `${past.day} ${past.month}`;
  }
  if (difference > 0) {
    return `${past.weekday}`;
  }
  return `${past.hour}:${past.min}`;
};
