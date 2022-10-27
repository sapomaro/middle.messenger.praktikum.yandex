import type {Block} from '../core/Block';

class RouterService {
  static __instance: RouterService;
  public routes: Record<string, Block> = {};
  public currentRoute: string;
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
      if (event && event.state && event.state.route) {
        this.navigate(event.state.route);
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
  routeExists(pathname: string) {
    return (pathname in this.routes);
  }
  getRealRoute(pathname: string) {
    if (pathname.length > 1 && pathname.slice(-1) === '/') {
      pathname = pathname.slice(0, -1);
    }
    if (!this.routeExists(pathname)) {
      if (this.routeExists(this.notFoundRoute)) {
        return this.notFoundRoute;
      }
      return null;
    }
    return pathname;
  }
  renderRoute(route: string) {
    if (this.currentView) {
      this.currentView.destroy();
    }
    this.currentView = this.routes[route];
    this.currentRoute = route;
    this.currentView.renderToBody();
  }
  redirect(pathname: string) {
    const route = this.getRealRoute(pathname);
    if (route === null) return;
    history.replaceState({route}, '', pathname);
    this.renderRoute(route);
  }
  navigate(pathname: string) {
    const route = this.getRealRoute(pathname);
    if (route === null) return;
    if (this.firstRender) {
      history.replaceState({route}, '', pathname);
      this.firstRender = false;
    } else {
      if (!history.state || !history.state.route ||
          history.state.route !== route) {
        history.pushState({route}, '', pathname);
      }
    }
    this.renderRoute(route);
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
