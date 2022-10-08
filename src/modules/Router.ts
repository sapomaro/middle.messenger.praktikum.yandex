// Это самая базовая версия Роутера.
// Он будет доделываться в 3-м спринте.

const Router = {
  views: {},
  registerViews: function(views: Record<string, unknown>) {
    this.views = {...this.views, ...views};
  },
  renderView: function(route: string) {
    if (window.history.state && window.history.state.page &&
      window.history.state.page !== route) {
      window.history.pushState({page: route}, '');
    }
    this.views[route].renderToBody();
  },
};

window.addEventListener('popstate', (event: PopStateEvent) => {
  if (event && event.state && event.state.page) {
    Router.renderView(event.state.page);
  }
});

export {Router};
