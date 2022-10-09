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
  headers?: Record<string, string>;
  data?: Record<string, unknown>;
}

type Options = InitOptions & {
  data?: Record<string, unknown>;
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
  responseText?: string;
  responseHeaders?: Record<string, string>;
  error?: Error;
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
      successCallback: ({responseText, responseHeaders}): void => {
        request.responseText = responseText;
        request.responseHeaders = responseHeaders;
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

const ajaxRequest = function ajaxRequest(url: string,
    options: Options) {
  const xhr = new XMLHttpRequest();
  const method = (options.method ? options.method : METHOD.GET);
  const tries = (options.tries ? --options.tries : 0);
  const data = (options.data ? options.data : {});
  const urlParams = (method === METHOD.GET ? getUrlParams(data) : '');

  xhr.open(method, url + urlParams, true);
  xhr.timeout = (options.timeout ? options.timeout : 3000);

  const headers = options.headers || {};
  if (typeof data === 'object' && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json; charset = UTF-8';
  }
  for (const [key, value] of Object.entries(headers)) {
    xhr.setRequestHeader(key, value);
  }

  const handleError = (error: unknown): void => {
    if (tries) {
      ajaxRequest(url, options);
    } else {
      if (typeof options.errorHandler === 'function') {
        options.errorHandler(error);
      }
    }
  };

  if (options.method === METHOD.GET || !data) {
    xhr.send();
  } else {
    try {
      xhr.send(JSON.stringify(data));
    } catch (error) {
      handleError(error);
    }
  }

  xhr.onreadystatechange = (): void => {
    if (xhr.readyState === 4) {
      const responseHeaders = getResponseHeaders(xhr);
      if (xhr.status >= 200 && xhr.status <= 299) {
        const responseText = xhr.responseText.replace(/^\"|\"$/g, '');
        if (typeof options.successCallback === 'function') {
          options.successCallback({responseText, responseHeaders});
        }
      } else if (xhr.status >= 400) {
        if (typeof options.errorHandler === 'function') {
          options.errorHandler({responseHeaders, status: xhr.status});
        }
      }
    }
  };
  xhr.onabort = handleError;
  xhr.onerror = handleError;
  xhr.ontimeout = handleError;

  return xhr;
};

const getUrlParams = (data: Record<string, unknown>) => {
  const urlData: Record<string, string> = {};
  for (const [key, value] of Object.entries(data)) {
    if (typeof value !== 'string' ||
        typeof value !== 'number' ||
        typeof value !== 'boolean') {
      continue;
    }
    urlData[key] = value;
  }
  let urlParams = '?';
  urlParams += (new URLSearchParams(urlData)).toString();
  if (urlParams === '?') {
    urlParams = '';
  }
  return urlParams;
};

const getResponseHeaders = (xhr: XMLHttpRequest) => {
  const headers: Record<string, string> = {};
  const headersString = xhr.getAllResponseHeaders();
  const headersList = headersString.trim().split('\r\n');
  for (const header of headersList) {
    const [key, value] = header.split(': ');
    headers[key] = value;
  }
  return headers;
};

export {ajax};
