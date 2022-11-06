## Описание

Это веб-мессенджер: учебный проект «Яндекс.Практикума» (курс «Мидл фронтенд-разработчик»). 

Сейчас проект находится в стадии доработки функционала (пройдено три спринта).

Ссылка на собранную рабочую версию на Netlify: https://cheery-pothos-620783.netlify.app/menu (меню со ссылками на все страницы приложения).

Ссылка на пулл-реквест в главную ветку по итогам третьего спринта: https://github.com/sapomaro/middle.messenger.praktikum.yandex/pull/16

## Проблемы, которые предстоит решить

- При обновлении аватара на профиле сервер кидает ошибку 500 (/src/api/GlobalAPI.ts:28)

- В тестах у XHR не срабатывает таймаут (/src/core/tests/HTTPTransport.test.ts:31)

## Команды

Запуск dev-сервера Webpack (http://localhost:1234/): 

    npm run dev

Запуск сборки и сервера для раздачи статики (http://localhost:3000/):

    npm run start

Проверка кода компилятором tsc, линтерами ESLint и Stylelint:

    npm run lint

Запуск тестов Jest & msw (ими покрыты основные модули в /src/core/):

    npm test

Для вывода развёрнутого отчёта по тестированию (включая покрытие):

    npm run testreport

## Прочее

В проекте используется самописный шаблонизатор.

Ссылка на макет в Figma: https://www.figma.com/file/jF5fFFzgGOxQeB4CmKWTiE/Chat_external_link?node-id=0%3A1 
