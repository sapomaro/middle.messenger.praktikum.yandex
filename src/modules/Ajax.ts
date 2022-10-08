/*
  SYNTAX:

  ajax({
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

enum METHOD {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

type Fn = (...args: Array<unknown>) => void;

type InitOptions = {
  url?: string;
  method?: METHOD;
  tries?: number;
  timeout?: number;
  data?: Record<string, unknown>;
}

type Options = InitOptions & {
  data?: unknown;
  body?: unknown;
  successCallback: Fn;
  errorHandler: Fn;
};

type Handler = {
  (callback: Fn): State;
  trigger: () => void;
  callbacks: Array<Fn>;
}

type State = InitOptions & {
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
  let data: Record<string, unknown> = {};
  if (typeof options.body === 'object' && options.body !== null) {
    data = options.body as Record<string, unknown>;
  }
  if (typeof options.data === 'object' && options.data !== null) {
    data = options.data as Record<string, unknown>;
  }
  let urlParams = '';
  if (method === METHOD.GET) {
    try {
      urlParams = '?' +
        (new URLSearchParams(data as Record<string, string>)).toString();
    } catch (error) {
      if (typeof options.errorHandler === 'function') {
        options.errorHandler(error);
      }
    }
    if (urlParams === '?') {
      urlParams = '';
    }
  }

  xhr.open(method, url + urlParams, true);

  xhr.timeout = (typeof options.timeout === 'number') ?
    options.timeout : 3000;

  if (options.method === 'GET' || !data) {
    xhr.send();
  } else {
    try {
      xhr.send(JSON.stringify(data));
    } catch (error) {
      if (typeof options.errorHandler === 'function') {
        options.errorHandler(error);
      }
    }
  }

  console.log(`${method} ${url + urlParams}`);

  xhr.onreadystatechange = (): void => {
    if (xhr.readyState === 4) {
      if (xhr.status >= 200 && xhr.status <= 299) {
        const response = xhr.responseText.replace(/^\"|\"$/g, '');
        if (typeof options.successCallback === 'function') {
          options.successCallback(response);
        }
      } else if (xhr.status >= 400) {
        if (typeof options.errorHandler === 'function') {
          options.errorHandler({status: xhr.status});
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

const ajax = function(options: InitOptions): State {
  const request: State = {
    url: options.url,
    options,
    then: (() => {
      const handler: Handler = (callback: Fn): State => {
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
      const handler: Handler = (callback: Fn): State => {
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
      const handler: Handler = (callback: Fn): State => {
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

ajax.get = (url: string, data?: Record<string, string>): State => {
  return ajax({url, method: METHOD.GET, data});
};
ajax.post = (url: string, data?: Record<string, unknown>): State => {
  return ajax({url, method: METHOD.POST, data});
};
ajax.put = (url: string, data?: Record<string, unknown>): State => {
  return ajax({url, method: METHOD.PUT, data});
};
ajax.delete = (url: string, data?: Record<string, unknown>): State => {
  return ajax({url, method: METHOD.DELETE, data});
};

export {ajax};
