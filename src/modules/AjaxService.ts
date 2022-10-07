/*
  SYNTAX:

  const ajax = AjaxRequest({
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

const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

const ajaxRequest = function ajaxRequest(url: string,
                                         options: Record<string, any> = {}) {
  const xhr = new XMLHttpRequest();
  const method: string = options.method || METHODS.GET;
  if (typeof options.tries === 'undefined') {
    options.tries = 0;
  } else {
    --options.tries;
  }
  xhr.open(method, url, true);
  xhr.timeout = options.timeout || 3000;
  const data: Record<string, any> = options.body || options.data;
  if (options.method === 'GET' || !data) {
    xhr.send();
  } else {
    xhr.send(JSONWrapper.stringify(data));
  }

  xhr.onreadystatechange = (): void => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const response = xhr.responseText.replace(/^\"|\"$/g, '');
        if (options.successCallback) {
          options.successCallback(response);
        }
      }
    }
  };

  const handleError = (error: unknown): void => {
    if (options.tries) {
      ajaxRequest(url, options);
    } else {
      if (options.errorHandler) {
        options.errorHandler(error);
      }
    }
  };
  xhr.onabort = handleError;
  xhr.onerror = handleError;
  xhr.ontimeout = handleError;
  return xhr;
};

type Handler = {
  (callback: Function): Request;
  trigger: Function;
  callbacks: Array<Function>;
}

type Request = {
  url: string;
  xhr: XMLHttpRequest;
  then: Handler;
  catch: Handler;
  finally: Handler;
  response: string;
  error: Error;
  options: Record<string, any>;
};

export const AjaxRequest = (request: Request): Request => {
  request.then = (() => {
    const handler: Handler = (callback: Function): Request => {
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
  })();

  request.catch = (() => {
    const handler: Handler = (callback: Function): Request => {
      handler.callbacks = [callback];
      return request;
    };
    handler.callbacks = [() => {}];
    handler.trigger = (): void => {
      handler.callbacks[0](request);
      request.finally.trigger();
    };
    return handler;
  })();

  request.finally = (() => {
    const handler: Handler = (callback: Function): Request => {
      handler.callbacks = [callback];
      return request;
    };
    handler.callbacks = [() => {}];
    handler.trigger = (): void => {
      handler.callbacks[0](request);
    };
    return handler;
  })();

  try {
    request.xhr = ajaxRequest(request.url, {
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
