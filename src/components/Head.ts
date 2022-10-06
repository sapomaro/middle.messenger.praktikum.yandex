import {EventBus} from '../modules/EventBus';

const favicon = new URL('../../public/favicon.ico', import.meta.url);

EventBus.on('init', (): void => {
  document.head.innerHTML += `
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>%{title}%</title>
    <link href="${favicon}" rel="icon" />
  `;
});
