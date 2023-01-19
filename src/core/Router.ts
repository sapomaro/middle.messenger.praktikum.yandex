import type {Block} from '../core/Block';

class RouterService {
  static __instance: RouterService;
  public routes: Record<string, Block> = {};
  public basePath = '';
  public currentRoute = '';
  public currentPathname = '';
  public currentView: Block;
  private firstRender = true;
  private notFoundRoute = '';

  constructor() {
    if (RouterService.__instance) {
      return RouterService.__instance;
    }
    RouterService.__instance = this;
    this.init();
  }
  init() {
    window.addEventListener('popstate', (event: PopStateEvent) => {
      if (event && event.state && event.state.pathname) {
        this.navigate(event.state.pathname);
      }
    });
  }
  registerRoutes(routes: Record<string, Block>) {
    this.routes = {...this.routes, ...routes};
  }
  registerNotFound(route: Record<string, Block>) {
    this.routes = {...this.routes, ...route};
    this.notFoundRoute = Object.keys(route).pop() as string;
  }
  getCurrentPathname(trimmed = true) {
    let currentPathname = this.currentPathname;
    if (trimmed && currentPathname[0] === '/') {
      currentPathname = currentPathname.slice(1);
    }
    return currentPathname;
  }
  searchRealRoute(pathname: string) {
    if (pathname in this.routes) return pathname;
    for (const route of Object.keys(this.routes)) {
      const rule = new RegExp('^' + route + '$');
      if (rule.test(pathname)) return route;
    }
    return null;
  }
  getRealRoute(pathname: string) {
    if (pathname.length > 1 && pathname.slice(-1) === '/') {
      pathname = pathname.slice(0, -1);
    }
    const route = this.searchRealRoute(pathname);
    if (route === null) {
      if (this.notFoundRoute) {
        return this.notFoundRoute;
      }
      return null;
    }
    return route;
  }
  renderRoute(route: string, pathname: string) {
    if (this.currentView) {
      this.currentView.unmount();
    }
    this.currentView = this.routes[route];
    this.currentRoute = route;
    this.currentPathname = pathname;
    this.currentView.renderToBody();
  }
  redirect(pathname: string) {
    const route = this.getRealRoute(pathname);
    if (route === null) return;
    history.replaceState({route, pathname}, '', this.basePath + pathname);
    this.renderRoute(route, pathname);
  }
  navigate(pathname: string) {
    let route = this.getRealRoute(pathname);
    if (route === null) return;
    if (this.firstRender) {
      if (route === this.notFoundRoute) {
        route = '/';
      }
      history.replaceState({route, pathname}, '', this.basePath + pathname);
      this.firstRender = false;
    } else {
      if (!history.state || !history.state.route ||
          history.state.route !== route) {
        history.pushState({route, pathname}, '', this.basePath + pathname);
      }
    }
    this.renderRoute(route, pathname);
  }
  back() {
    history.back();
  }
  forward() {
    history.forward();
  }
}

const Router = new RouterService();

export {Router};
