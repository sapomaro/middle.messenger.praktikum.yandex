import {isPlainObject, isArrayOrObject} from './Utils';
import type {PlainObject, ResponseT} from '../constants/types';

enum METHOD {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

export type OptionsT = {
  url: string;
  method: METHOD;
  tries: number;
  timeout: number;
  headers: Record<string, string>;
  data: unknown;
};

export class HTTPTransport {
  public baseUrl = '';
  get(url: string, data?: unknown) {
    return this.request({url, method: METHOD.GET, data});
  }
  post(url: string, data?: unknown) {
    return this.request({url, method: METHOD.POST, data});
  }
  put(url: string, data?: unknown) {
    return this.request({url, method: METHOD.PUT, data});
  }
  delete(url: string, data?: unknown) {
    return this.request({url, method: METHOD.DELETE, data});
  }
  request(options: Partial<OptionsT>) {
    let {
      url,
      method = METHOD.GET,
      data = '',
      tries = 1,
      timeout = 3000,
      headers = {},
    } = options;
    const dataType = (typeof data === 'string') ? 'string' :
      (typeof data === 'object' && data instanceof FormData) ? 'formdata' :
      (isArrayOrObject(data)) ? 'json' : 'unknown';
    const urlParams = (method === METHOD.GET && dataType === 'json') ?
      this.getUrlParams(data as Record<string, unknown>) : '';
    headers = this.getRequestHeaders(headers, dataType);

    return new Promise((resolve, reject) =>
      (function request() {
        const xhr = new XMLHttpRequest();
        xhr.open(method, this.baseUrl + url + urlParams, true);
        xhr.withCredentials = true;
        xhr.timeout = timeout;
        for (const [key, value] of Object.entries(headers)) {
          xhr.setRequestHeader(key, value);
        }
        if (method === METHOD.GET || !data) {
          xhr.send();
        } else if (dataType === 'json') {
          try {
            xhr.send(JSON.stringify(data as PlainObject));
          } catch (error) {
            reject(error);
          }
        } else {
          xhr.send(data as string | Blob);
        }
        xhr.onreadystatechange = (): void => {
          if (xhr.readyState === 4) {
            const responseText = xhr.responseText.replace(/^\"|\"$/g, '');
            const responseHeaders = this.getResponseHeaders(xhr);
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
            const response: ResponseT = {
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
        const handleError = (error: ProgressEvent): void => {
          if (--tries > 0) {
            request();
          } else {
            reject(error);
          }
        };
        xhr.onabort = handleError;
        xhr.onerror = handleError;
        xhr.ontimeout = handleError;
      }.bind(this))(),
    );
  }

  getRequestHeaders(headers: OptionsT['headers'], dataType: string) {
    if (dataType === 'json') {
      if (!headers['accept']) {
        headers['accept'] = 'application/json';
      }
      if (!headers['Content-Type']) {
        headers['Content-Type'] = 'application/json; charset = UTF-8';
      }
    }
    return headers;
  }

  getResponseHeaders(xhr: XMLHttpRequest) {
    const headers: Record<string, string> = {};
    const headersString = xhr.getAllResponseHeaders();
    const headersList = headersString.trim().split('\r\n');
    for (const header of headersList) {
      if (!header || header.indexOf(':') === -1) continue;
      const [key, value] = header.split(': ');
      headers[key.toLowerCase()] = value.toLowerCase();
    }
    return headers;
  }

  getKey(key: string, parentKey?: string) {
    return parentKey ? `${parentKey}[${key}]` : key;
  }

  getParams(data: PlainObject | [], parentKey?: string) {
    const result: [string, string][] = [];
    for (const [key, value] of Object.entries(data)) {
      if (isArrayOrObject(value)) {
        result.push(...this.getParams(value, this.getKey(key, parentKey)));
      } else {
        result.push([
          this.getKey(key, parentKey),
          encodeURIComponent(String(value)),
        ]);
      }
    }
    return result;
  }

  getUrlParams(data: PlainObject) {
    if (!isPlainObject(data)) {
      throw new Error('input must be an object');
    }
    return '?' + this.getParams(data).map((arr) => arr.join('=')).join('&');
  }
}
