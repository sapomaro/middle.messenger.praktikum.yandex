import {EventBus} from '/src/modules/EventBus.js';

const favicon = new URL('../../public/favicon.ico', import.meta.url);

EventBus.on('init', () => {
  document.head.innerHTML += `
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>%{title}%</title>
    <link href="${favicon}" rel="icon" />
  `;
});
