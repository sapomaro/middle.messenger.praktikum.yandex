import {Block} from '../modules/Block';

class RouterService {
  static __instance: RouterService;
  public routes: Record<string, Block>;
  private counter: number;

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
    if (!this.routeExists(route)) {
      console.warn(`${route} doesn't exist!`);
      return;
    }
    if (++this.counter > 1) { // для определения перезагрузки страницы
      if (!history.state || !history.state.route ||
          history.state.route !== route) {
        history.pushState({route}, '', route);
      }
    } else {
      if (this.routeExists(location.pathname)) {
        route = location.pathname;
      }
      history.replaceState({route}, '', route);
    }
    const view = this.routes[route];
    view.renderToBody();
  }
}

const Router = new RouterService;

export {Router};
