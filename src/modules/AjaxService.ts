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

import {JSONWrapper} from '/src/modules/Utils';

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

type Request = {
  url: string;
  xhr: XMLHttpRequest;
  
};

export const AjaxRequest = function(request: Request): Request {
  request.then = function(callback: Function): Request {
    request.then.callbacks = request.then.callbacks || [];
    request.then.callbacks.push(callback);
    return request;
  };
  request.then.trigger = function(): void {
    for (const callback of request.then.callbacks) {
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

  request.catch = function(callback: Function): Request {
    request.catch.callback = callback;
    return request;
  };
  request.catch.trigger = function(): void {
    request.catch.callback(request);
    request.finally.trigger();
  };
  request.catch(function() {});

  request.finally = function(callback: Function): Request {
    request.finally.callback = callback;
    return request;
  };
  request.finally.trigger = function(): void {
    request.finally.callback(request);
  };
  request.finally(function() {});

  try {
    request.xhr = ajaxRequest(request.url, {
      ...(request.options || {}),
      successCallback: (response: string): void => {
        request.response = response;
        request.then.trigger();
      },
      errorHandler: (error: unknown): void => {
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
