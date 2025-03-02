import { domainRoot } from '../data/config.js';
import { eventNames } from '../data/enums.js';
import { routes, aliases } from '../data/routes.js';

export class Navigator {
  constructor(containerId) {
    this.container = document.querySelector(containerId);

    this.$subPageContainers = {};

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
    window.addEventListener(eventNames.NAVIGATE.description, (e) => {
      // console.log(`... received navigation event: ${JSON.stringify(e.detail)}`);
      this.navigateTo(e.detail.target, true, e.detail.data ? e.detail.data : {});
    });

    window.addEventListener(eventNames.SUB_PAGE_CONTAINER.description, (e) => {
      // console.log(eventNames.SUB_PAGE_CONTAINER.description, e.detail);
      this.$subPageContainers[e.detail.route] = e.detail.container;
    });
  }

  createCanonicalUrl(path) {
    return `${ domainRoot }/${ path }`;
  }

  createContentElement(content) {
    return `<${ content }></${ content }>`;
  }

  getRoute(route) {
        let alias = aliases[route];
    if (!alias) alias = route;

    if (!routes[alias]) alias = "/404";

    let r = routes[alias];
    return {
      content: this.createContentElement(r.content),
      title: r.title,
      description: r.description,
      canonicalUrl: this.createCanonicalUrl(r.path),
      structuredData: {
        // https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
        // https://developers.google.com/search/docs/appearance/structured-data/search-gallery
        "@context": "https://schema.org",
        "@type": r.pathType,
        name: r.title,
        description: r.description,
        url: this.createCanonicalUrl(r.path),
        subroute: r.subroute
      },
      subroute: r.subroute
    };
  }

  navigateTo(path, pushState = true, stateData = {}) {
    // console.log(`navigateTo(${path}, ${pushState}, ${JSON.stringify(stateData)})`);
    path = this.normalisePath(path);
    const route = this.getRoute(path);
    this.updateContent(path, route.subroute, route.content);
    this.updateMetadata(route);
    if (pushState) {
      window.history.pushState({}, '', path);
    }
  }

  normalisePath(path) {
    console.log(`---> normalisePath(${path})`);
    if (path == "/") return path;
    if (path == "") return "/";
    if (path[path.length - 1] == "/") path = path.slice(0, -1);
    return path;
  }

  updateCanonicalUrl(value) {
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel
    const link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      document.head.appendChild(link);
    }
    link.setAttribute("href", value);
  }

  updateContent(path, isSubroute, content) {
    // console.log(`--> updateContent(${path}, ${isSubroute}, ${content})`);
    if (!isSubroute) {
      this.container.innerHTML = content;
      return;
    }

    const elements = path.split("/");
    const elementsNum = elements.length;
    const parentPath = "/" + elements[elementsNum - 2];
    const parentContainer = this.$subPageContainers[parentPath];
    // console.log(parentPath, parentContainer);

    if (!parentContainer) {
      this.navigateTo(parentPath);

      setTimeout(() => {
        this.navigateTo(path);
      }, 100);
    }
    else {
      parentContainer.innerHTML = content;
    }
  }

  updateMetadata(route) {
    document.title = route.title;
    document.querySelector('meta[name="description"]').setAttribute('content', route.description);
    this.updateCanonicalUrl(route.canonicalUrl);
    this.updateStructuredData(route.structuredData);
  }

  updateStructuredData(data) {
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }
}
