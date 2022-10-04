/*
  SYNTAX:

  const ajax = AjaxRequest({
    url: 'http://localhost:1235/'
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

const ajaxRequest = function ajaxRequest(url, options = {}) {
  const xhr = new XMLHttpRequest();
  const method = options.method || METHODS.GET;
  if (typeof options.tries === 'undefined') {
    options.tries = 0;
  } else {
    --options.tries;
  }
  xhr.open(method, url, true);
  xhr.timeout = options.timeout || 3000;
  const data = options.body || options.data;
  if (options.method === 'GET' || !data) {
    xhr.send();
  } else {
    xhr.send(JSONWrapper.stringify(data));
  }

  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const response = xhr.responseText.replace(/^\"|\"$/g, '');
        if (options.successCallback) {
          options.successCallback(response);
        }
      }
    }
  };

  const handleError = (error) => {
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
};

export const AjaxRequest = function(request) {
  request.then = function(callback) {
    request.then.callbacks = request.then.callbacks || [];
    request.then.callbacks.push(callback);
    return request;
  };
  request.then.trigger = function() {
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

  request.catch = function(callback) {
    request.catch.callback = callback;
    return request;
  };
  request.catch.trigger = function() {
    request.catch.callback(request);
    request.finally.trigger();
  };
  request.catch(function() {});

  request.finally = function(callback) {
    request.finally.callback = callback;
    return request;
  };
  request.finally.trigger = function() {
    request.finally.callback(request);
  };
  request.finally(function() {});

  try {
    request.xhr = ajaxRequest(request.url, {
      ...(request.options || {}),
      successCallback: (response) => {
        request.response = response;
        request.then.trigger();
      },
      errorHandler: (error) => {
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
