/*
  SYNTAX:

  Ajax({
    url: 'http://localhost:1234/'
  })
  .then(({response}) => {
    console.log(response);
  })
  .catch(({error}) => {
    console.warn(error);
  })
  .finally(() => {
    console.log('job done');
  });

*/

import {JSONWrapper} from './Utils';

enum METHOD {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

type Fn = (...args: Array<unknown>) => void;

type Handler = {
  (callback: Fn): Request;
  trigger: () => void;
  callbacks: Array<Fn>;
}

type InitOptions = {
  url?: string;
  method?: METHOD;
  tries?: number;
  timeout?: number;
}

type Options = InitOptions & {
  data?: unknown;
  body?: unknown;
  successCallback: Fn;
  errorHandler: Fn;
};

type Request = InitOptions & {
  then: Handler;
  catch: Handler;
  finally: Handler;
  xhr?: XMLHttpRequest;
  options?: Record<string, unknown>;
  response?: string;
  error?: Error;
};

const ajaxRequest = function ajaxRequest(url: string,
    options: Options) {
  const xhr = new XMLHttpRequest();
  const method: string = (typeof options.method === 'string') ?
    options.method : METHOD.GET;
  if (typeof options.tries === 'number') {
    --options.tries;
  } else {
    options.tries = 0;
  }
  xhr.open(method, url, true);
  xhr.timeout = (typeof options.timeout === 'number') ?
    options.timeout : 3000;

  let data: Record<string, unknown> = {};
  if (typeof options.body === 'object' && options.body !== null) {
    data = options.body as Record<string, unknown>;
  }
  if (typeof options.data === 'object' && options.data !== null) {
    data = options.data as Record<string, unknown>;
  }

  if (options.method === 'GET' || !data) {
    xhr.send();
  } else {
    xhr.send(JSONWrapper.stringify(data));
  }

  xhr.onreadystatechange = (): void => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const response = xhr.responseText.replace(/^\"|\"$/g, '');
        if (typeof options.successCallback === 'function') {
          options.successCallback(response);
        }
      }
    }
  };

  const handleError = (error: unknown): void => {
    if (options.tries) {
      ajaxRequest(url, options);
    } else {
      if (typeof options.errorHandler === 'function') {
        options.errorHandler(error);
      }
    }
  };
  xhr.onabort = handleError;
  xhr.onerror = handleError;
  xhr.ontimeout = handleError;
  return xhr;
};

export const ajax = (options: InitOptions): Request => {
  const request: Request = {
    ...options,
    then: (() => {
      const handler: Handler = (callback: Fn): Request => {
        handler.callbacks.push(callback);
        return request;
      };
      handler.callbacks = [];
      handler.trigger = (): void => {
        for (const callback of handler.callbacks) {
          try {
            callback(request);
          } catch (error) {
            request.error = error;
            request.catch.trigger();
            break;
          }
        }
        request.finally.trigger();
      };
      return handler;
    })(),

    catch: (() => {
      const handler: Handler = (callback: Fn): Request => {
        handler.callbacks = [callback];
        return request;
      };
      handler.callbacks = [() => undefined];
      handler.trigger = (): void => {
        handler.callbacks[0](request);
        request.finally.trigger();
      };
      return handler;
    })(),

    finally: (() => {
      const handler: Handler = (callback: Fn): Request => {
        handler.callbacks = [callback];
        return request;
      };
      handler.callbacks = [() => undefined];
      handler.trigger = (): void => {
        handler.callbacks[0](request);
      };
      return handler;
    })(),
  };

  try {
    request.xhr = ajaxRequest(request.url ?? '', {
      ...(request.options || {}),
      successCallback: (response: string): void => {
        request.response = response;
        request.then.trigger();
      },
      errorHandler: (error: Error): void => {
        request.error = error;
        request.catch.trigger();
      },
    });
  } catch (error) {
    request.error = error;
    request.catch.trigger();
  }

  return request;
};
