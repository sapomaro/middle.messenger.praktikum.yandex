import {HTTPTransport} from '../HTTPTransport';
// import {sleep} from '../Utils';

const http = new HTTPTransport();
http.baseUrl = 'http://mockhost';

describe('core/HTTPTransport', () => {
  it('should send requests', async () => {
    await http.request({url: '/mock/path'})
        .then(({status}) => {
          expect(status).toBe(200);
        })
        .catch((error) => {
          expect(error).toBe(null);
          throw new Error();
        });
  });

  it('should send requests with headers', async () => {
    await http.request({url: '/mock/path', headers: {'mock-header': 'test'}})
        .then(({status, responseHeaders}) => {
          expect(status).toBe(200);
          expect(responseHeaders['mock-header']).toBe('test');
        })
        .catch((error) => {
          expect(error).toBe(null);
          throw new Error();
        });
  });

  /*  ОСТОРОЖНО, ЗДЕСЬ БАГ!
      В тесте запрос не прерывается, несмотря на таймаут,
      ждёт ответа от сервера до конца.
      Вне jest прерывание срабатывает как надо.
  it('should abort on timeout', async () => {
    let requestStatus = 'init';
    http.request({url: '/mock/timeout', timeout: 500})
        .then(({status}) => {
          requestStatus = 'success';
          expect(status).not.toBe(200);
        })
        .catch((error) => {
          requestStatus = 'error';
          expect(error).toHaveProperty('timeout');
        });

    await sleep(2000);

    expect(requestStatus).toBe('error');
  });
  */

  it('should send get requests with parameters', async () => {
    await http.get('/mock/path', {param: 'mock'})
        .then(({status, responseJSON}) => {
          expect(status).toBe(200);
          expect(responseJSON).toEqual({param: 'mock'});
        })
        .catch((error) => {
          expect(error).toBe(null);
          throw new Error();
        });
  });

  it('should send post requests with JSON', async () => {
    await http.post('/mock/path', {postprop: 'mock'})
        .then(({status, responseJSON}) => {
          expect(status).toBe(200);
          expect(responseJSON).toEqual({postprop: 'mock'});
        })
        .catch((error) => {
          expect(error).toBe(null);
          throw new Error();
        });
  });

  it('should send put requests with JSON', async () => {
    await http.put('/mock/path', {putprop: 'mock'})
        .then(({status, responseJSON}) => {
          expect(status).toBe(200);
          expect(responseJSON).toEqual({putprop: 'mock'});
        })
        .catch((error) => {
          expect(error).toBe(null);
          throw new Error();
        });
  });

  it('should send delete requests with JSON', async () => {
    await http.delete('/mock/path', {deleteprop: 'mock'})
        .then(({status, responseJSON}) => {
          expect(status).toBe(200);
          expect(responseJSON).toEqual({deleteprop: 'mock'});
        })
        .catch((error) => {
          expect(error).toBe(null);
          throw new Error();
        });
  });
});
