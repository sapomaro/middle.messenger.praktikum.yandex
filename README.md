## Описание

Это веб-мессенджер (клиентская часть под API Яндекса) – учебный проект в рамках прохождения курса «Мидл фронтенд-разработчик» в «Яндекс.Практикуме».

Движок веб-приложения реализован на чистом Typescript с применением самописных модулей для роутинга, шаблонизации, работы с собственными реактивными компонентами, событиями и XHR-запросами. За два с половиной месяца написано около 5500 строк кода (120 файлов, 200 коммитов).

Используемые зависимости: Express, Webpack с лоадерми, Sass, ESLint, Stylelint, Jest, MSW, Husky и др.

Собранная рабочая desktop-версия:

- Github Pages: https://sapomaro.github.io/messenger

- Heroku: https://cherry-pothos.herokuapp.com/menu

- Netlify: https://cheery-pothos-620783.netlify.app/menu 

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

В проекте используется Husky для запуска линтеров и тестов перед git-commit.

## Моменты, которые предстоит решить

- Сделать макет для мобильной версии

- Добавить в чате функцию прикрепления изображений, файлов и локации

- В тестах у XHR не срабатывает таймаут (/src/core/tests/HTTPTransport.test.ts:31)

## Прочее

Ссылка на макет в Figma: https://www.figma.com/file/jF5fFFzgGOxQeB4CmKWTiE/Chat_external_link?node-id=0%3A1 
