import {EventBus} from '../../core/EventBus';

EventBus.on('init', (): void => {
  const head = document.head;
  let title = head.querySelector<HTMLElement>('title');
  let metaCharset = head.querySelector<HTMLElement>('meta[charset]');
  let metaViewport = head.querySelector<HTMLElement>('meta[name=viewport]');

  if (!title) {
    title = document.createElement('title');
    head.appendChild(title);
  }
  title.innerHTML = '%{title}%';

  if (!metaCharset) {
    metaCharset = document.createElement('meta');
    head.appendChild(metaCharset);
  }
  metaCharset.setAttribute('charset', 'utf-8');

  if (!metaViewport) {
    metaViewport = document.createElement('meta');
    metaViewport.setAttribute('name', 'viewport');
    head.appendChild(metaViewport);
  }
  metaViewport.setAttribute('content', 'width=device-width, initial-scale=1');
});
