import type {Block} from '../modules/Block';

class RouterService {
  static __instance: RouterService;
  public routes: Record<string, Block> = {};
  private firstRender = true;
  private notFoundRoute = '/404';

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
  routeExists(route: string) {
    return (route in this.routes);
  }
  registerRoutes(routes: Record<string, Block>) {
    this.routes = {...this.routes, ...routes};
  }
  navigate(route: string) {
    if (!this.routeExists(route) && this.routeExists(this.notFoundRoute)) {
      route = this.notFoundRoute;
    }
    if (this.firstRender) {
      history.replaceState({route}, '', route);
      this.firstRender = false;
    } else {
      if (!history.state || !history.state.route ||
          history.state.route !== route) {
        history.pushState({route}, '', route);
      }
    }
    const view = this.routes[route];
    view.renderToBody();
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
