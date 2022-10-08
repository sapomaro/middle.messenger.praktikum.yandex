## Описание

Это веб-мессенджер: учебный проект «Яндекс.Практикума» (курс «Мидл фронтенд-разработчик»). 

Сейчас проект находится в стадии разработки интерфейса (2-й спринт).

Ссылка на текущую собранную версию на Netlify: https://cheery-pothos-620783.netlify.app/

Ссылка на пулл-реквест (2-й спринт) в главную ветку: https://github.com/sapomaro/middle.messenger.praktikum.yandex/pull/10

## Вопросы

Никак не получается настроить типизацию в следующем коде (/src/components/forms/Form.ts:19):

    // @ts-ignore: TS7015: Element implicitly has an 'any' type
    // because index expression is not of type 'number'.
    // Что ему не нравится? document.forms работает не только по number,
    // но и по string, плюс сделаны все необходимые проверки
    const form: unknown = document.forms[props.name];
    if (typeof form !== 'object' || !(form instanceof HTMLFormElement)) {
      return false;
    }

## Команды

Запуск dev-сервера Parcel (http://localhost:1234/): 

    npm run dev

Запуск сборки и сервера для раздачи статики (http://localhost:3000/):

    npm run start

Проверка кода компилятором tsc, линтерами ESLint и Stylelint:

    npm run lint

## Шаблонизатор

В проекте используется самописный шаблонизатор.

## Прочее

Ссылка на макет в Figma: https://www.figma.com/file/jF5fFFzgGOxQeB4CmKWTiE/Chat_external_link?node-id=0%3A1 (в интерфейсе ещё предполагается доработка некоторых мелких деталей по макету)
