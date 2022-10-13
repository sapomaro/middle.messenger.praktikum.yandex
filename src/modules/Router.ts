import {Block} from '../modules/Block';

class RouterService {
  static __instance: RouterService;
  public routes: Record<string, Block>;
  private counter: number;
  private notFoundRoute = '/404';

  constructor() {
    if (RouterService.__instance) {
      return RouterService.__instance;
    }
    RouterService.__instance = this;
    this.routes = {};
    this.counter = 0;
    this.init();
  }
  init() {
    window.addEventListener('popstate', (event: PopStateEvent) => {
      if (event && event.state && event.state.route) {
        this.renderView(event.state.route);
      }
    });
  }
  routeExists(route: string) {
    return (route in this.routes);
  }
  registerViews(routes: Record<string, Block>) {
    this.routes = {...this.routes, ...routes};
  }
  renderView(route: string) {
    if (++this.counter > 1) { // для определения перезагрузки страницы
      if (!history.state || !history.state.route ||
          history.state.route !== route) {
        if (!this.routeExists(route) && this.routeExists(this.notFoundRoute)) {
          route = this.notFoundRoute;
        }
        history.pushState({route}, '', route);
      }
    } else {
      if (this.routeExists(location.pathname)) {
        route = location.pathname;
      } else if (this.routeExists(this.notFoundRoute)) {
        route = this.notFoundRoute;
      }
      history.replaceState({route}, '', route);
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
