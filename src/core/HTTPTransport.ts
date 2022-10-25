import {isPlainObject, isArrayOrObject, PlainObject} from './Utils';

enum METHOD {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

export type AJAXOptionsT = {
  url: string;
  method?: METHOD;
  tries?: number;
  timeout?: number;
  headers?: Record<string, string>;
  data?: unknown;
}

export class HTTPTransport {

}

function AJAXRequest(options: AJAXOptionsT) {
  const {
    url,
    method = METHOD.GET,
    data = '',
    tries = 0,
    headers = {},
  } = options;
  const dataType = (typeof data === 'string') ? 'string' :
    (typeof data === 'object' && data instanceof FormData) ? 'formdata' :
    (isArrayOrObject(data)) ? 'json' : 'unknown';
  const urlParams = (method === METHOD.GET && dataType === 'json') ?
    getUrlParams(data as Record<string, unknown>) : '';
  setRequestHeaders(headers, dataType);

  return new Promise((resolve, reject) =>
    (function request(options) {
      const handleError = (error: unknown): void => {
        if (tries) {
          request(url, options);
        } else {
          reject(error);
        }
      };
      const xhr = new XMLHttpRequest();
      xhr.open(method, ajax.baseUrl + url + urlParams, true);
      xhr.withCredentials = true;
      xhr.timeout = (options.timeout ? options.timeout : 3000);
      for (const [key, value] of Object.entries(headers)) {
        xhr.setRequestHeader(key, value);
      }
      if (method === METHOD.GET || !data) {
        xhr.send();
      } else if (dataType === 'json') {
        try {
          xhr.send(JSON.stringify(data as PlainObject));
        } catch (error) {
          handleError(error);
        }
      } else {
        xhr.send(data as string | Blob);
      }
      xhr.onreadystatechange = (): void => {
        if (xhr.readyState === 4) {
          const responseText = xhr.responseText.replace(/^\"|\"$/g, '');
          const responseHeaders = getResponseHeaders(xhr);
          let responseJSON: Record<string, unknown> = {};
          if (responseHeaders['content-type'] &&
              responseHeaders['content-type']
                  .indexOf('application/json') !== -1) {
            try {
              responseJSON = JSON.parse(responseText);
            } catch (error) {
              reject(error);
            }
          }
          const response = {
            responseText,
            responseJSON,
            responseHeaders,
            status: xhr.status,
          };
          if (xhr.status >= 200 && xhr.status <= 399) {
            resolve(response);
          } else if (xhr.status >= 400) {
            reject(response);
          }
        }
      };
      xhr.onabort = handleError;
      xhr.onerror = handleError;
      xhr.ontimeout = handleError;
    })(options),
  );


  return xhr;
};

function setRequestHeaders(headers, dataType) {
  if (!headers['accept']) {
    headers['accept'] = 'application/json';
  }
  if (!headers['Content-Type']) {
    if (dataType === 'json') {
      headers['Content-Type'] = 'application/json; charset = UTF-8';
    } else if (dataType === 'formdata') {
      headers['Content-Type'] = 'multipart/form-data';
    }
  }
}

function getResponseHeaders(xhr: XMLHttpRequest) {
  const headers: Record<string, string> = {};
  const headersString = xhr.getAllResponseHeaders();
  const headersList = headersString.trim().split('\r\n');
  for (const header of headersList) {
    const [key, value] = header.split(': ');
    headers[key.toLowerCase()] = value.toLowerCase();
  }
  return headers;
}

function getKey(key: string, parentKey?: string) {
  return parentKey ? `${parentKey}[${key}]` : key;
}

function getParams(data: PlainObject | [], parentKey?: string) {
  const result: [string, string][] = [];
  for (const [key, value] of Object.entries(data)) {
    if (isArrayOrObject(value)) {
      result.push(...getParams(value, getKey(key, parentKey)));
    } else {
      result.push([getKey(key, parentKey), encodeURIComponent(String(value))]);
    }
  }
  return result;
}

function getUrlParams(data: PlainObject) {
  if (!isPlainObject(data)) {
    throw new Error('input must be an object');
  }
  return getParams(data).map((arr) => arr.join('=')).join('&');
}
