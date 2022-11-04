import {Router} from '../Router';
import {sleep} from '../Utils';
import type {Block} from '../Block';

describe('core/Router', () => {
  it('should register routes', () => {
    const mockPage = {} as unknown as Block;
    mockPage.renderToBody = jest.fn();
    mockPage.destroy = jest.fn();

    Router.registerRoutes({'/test': mockPage});
    Router.registerRoutes({'/5\\d\\d': mockPage});
    Router.registerNotFound({'/404': mockPage});

    expect(Router.routes).toHaveProperty('/test', mockPage);
    expect(Router.routes).toHaveProperty('/404', mockPage);
  });

  it('should navigate to static routes', () => {
    Router.navigate('/test');

    expect(Router.currentRoute).toBe('/test');
    expect(Router.currentPathname).toBe('/test');
    expect(location.pathname).toBe('/test');
    expect(Router.getCurrentPathname()).toBe('test');
    expect(Router.getCurrentPathname(false)).toBe('/test');
  });

  it('should navigate to dynamic routes', () => {
    Router.navigate('/523');

    expect(Router.currentRoute).toBe('/5\\d\\d');
    expect(location.pathname).toBe('/523');
  });

  it('should render & destroy views', () => {
    const mockPage = {} as unknown as Block;
    mockPage.renderToBody = jest.fn();
    mockPage.destroy = jest.fn();

    Router.registerRoutes({'/test2': mockPage});
    Router.navigate('/test2');
    Router.navigate('/test');

    expect(mockPage.renderToBody).toBeCalledTimes(1);
    expect(mockPage.destroy).toBeCalledTimes(1);
  });

  it('should navigate to any route if 404 view was set', () => {
    Router.navigate('/wrongpath');

    expect(Router.currentRoute).toBe('/404');
    expect(location.pathname).toBe('/wrongpath');
  });

  it('should navigate back', async () => {
    Router.navigate('/test');
    Router.navigate('/test2');
    Router.back();

    await sleep(100);

    expect(Router.currentRoute).toBe('/test');
    expect(location.pathname).toBe('/test');
  });

  it('should navigate forward', async () => {
    Router.navigate('/test');
    Router.navigate('/test2');
    Router.back();

    await sleep(100);

    Router.forward();

    await sleep(100);

    expect(Router.currentRoute).toBe('/test2');
    expect(location.pathname).toBe('/test2');
  });

  it('should redirect', async () => {
    Router.navigate('/test');

    Router.navigate('/test2');
    Router.redirect('/404');

    Router.back();

    await sleep(100);

    expect(Router.currentRoute).toBe('/test');
    expect(location.pathname).toBe('/test');
  });
});
