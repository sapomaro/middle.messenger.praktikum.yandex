## Описание

Это веб-мессенджер: учебный проект «Яндекс.Практикума» (курс «Мидл фронтенд-разработчик»). 

Сейчас проект находится в стадии доработки дополнительного функционала (пройдено четыре спринта).

Собранная рабочая desktop-версия (откроет меню со ссылками на все страницы приложения):

- Heroku: https://cherry-pothos.herokuapp.com/menu

- Netlify: https://cheery-pothos-620783.netlify.app/menu 

## Моменты, которые предстоит решить

- Добавить в чате функцию прикрепления изображений, файлов и локации

- При обновлении аватара на профиле сервер кидает ошибку 500 (/src/api/GlobalAPI.ts:28)

- В тестах у XHR не срабатывает таймаут (/src/core/tests/HTTPTransport.test.ts:31)

## Команды

Запуск dev-сервера Webpack (http://localhost:3000/): 

    npm run dev

Запуск сборки и Express-сервера для раздачи статики (http://localhost:3000/):

    npm run start

Проверка кода компилятором tsc, линтерами ESLint и Stylelint:

    npm run lint

Запуск тестов Jest & msw (ими покрыты основные модули в /src/core/):

    npm test

Для вывода развёрнутого отчёта по тестированию (включая покрытие):

    npm run testreport

Для локальной сборки и запуска контейнера через Docker:

    docker build -t messenger .
    docker run -p 3000:3000 -d messenger

## Прочее

В проекте используется Husky для запуска линтеров и тестов перед git-commit.

Движок веб-приложения реализован с применением самописных модулей для роутинга, шаблонизации, работы с компонентами, событиями и XHR-запросами.

Ссылка на пулл-реквест в главную ветку по итогам четвёртого спринта: https://github.com/sapomaro/middle.messenger.praktikum.yandex/pull/22

Ссылка на макет в Figma: https://www.figma.com/file/jF5fFFzgGOxQeB4CmKWTiE/Chat_external_link?node-id=0%3A1 
