export class Navigator {
  constructor(containerId) {
    this.container = document.querySelector(containerId);
    this.routes = {
      '/page-one': '<page-one></page-one>',
      '/page-two': '<page-two></page-two>',
      '/404': '<h1>Page Not Found</h1>'
    };

    this.init();
  }

  init() {
    // Handle initial load
    this.navigateTo(window.location.pathname, false);

    // Handle back/forward navigation
    window.addEventListener('popstate', () => {
      this.navigateTo(window.location.pathname, false);
    });

    // Listen for custom navigate events
    window.addEventListener('navigate', (e) => {
      this.navigateTo(e.detail.target, true, e.detail.data ? e.detail.data : {});
    });
  }

  navigateTo(path, pushState = true, stateData = {}) {
    if (this.routes[path]) {
      this.container.innerHTML = this.routes[path];
      if (pushState) window.history.pushState(stateData, '', path);
    }
    else {
      this.navigateTo('/404', pushState);
    }
  }
}
