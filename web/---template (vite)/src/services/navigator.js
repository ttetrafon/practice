import { domainRoot } from '../data/config.js';
import { eventNames } from '../data/enums.js';

export class Navigator {
  constructor(containerId) {
    this.container = document.querySelector(containerId);

    this.routes = {
      '/': {
        content: '<page-one></page-one>',
        title: 'Page 1',
        description: 'This is page one!',
        canonicalUrl: `${domainRoot}/page-one`,
        structuredData: {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Page One",
          "description": "This is the first page of my app.",
          "url": `${domainRoot}/page-one`
        }
      },
      '/page-one': {
        content: '<page-one></page-one>',
        title: 'Page 1',
        description: 'This is page one!',
        canonicalUrl: `${domainRoot}/page-one`,
        structuredData: {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Page One",
          "description": "This is the first page of my app.",
          "url": `${domainRoot}/page-one`
        }
      },
      '/page-two': {
        content: '<page-two></page-two>',
        title: 'Page 2',
        description: 'This is page two!',
        canonicalUrl: `${domainRoot}/page-two`,
        structuredData: {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Page Two",
          "description": "This is the second page of my app.",
          "url": `${domainRoot}/page-two`
        }
      },
      '/tab-one': {
        content: '<tab-one></tab-one>',
        title: 'Page 2 - Tab 1',
        description: 'This is page two - tab 1!',
        canonicalUrl: `${domainRoot}/page-two/tab-one`,
        structuredData: {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Page Two - Tab one",
          "description": "This is the second page & first tab of my app.",
          "url": `${domainRoot}/page-two/tab-one`
        }
      },
      '/tab-two': {
        content: '<tab-two></tab-two>',
        title: 'Page 2 - Tab 2',
        description: 'This is page two - tab 2!',
        canonicalUrl: `${domainRoot}/page-two/tab-two`,
        structuredData: {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Page Two - Tab Two",
          "description": "This is the second page & second tab of my app.",
          "url": `${domainRoot}/page-two/tab-two`
        }
      },
      '/404': {
        content: '<h1>Page Not Found</h1>',
        title: 'Page not found',
        description: 'The page you request was not found!',
        canonicalUrl: `${domainRoot}/404`,
        structuredData: {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "404 - Page Not Found",
          "description": "The page you are looking for does not exist.",
          "url": `${domainRoot}/404`
        }
      }
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
    window.addEventListener(eventNames.NAVIGATE.description, (e) => {
      // console.log(`... received navigation event: ${JSON.stringify(e.detail)}`);
      this.navigateTo(e.detail.target, true, e.detail.data ? e.detail.data : {});
    });

    window.addEventListener(eventNames.SUB_PAGE_CONTAINER.description, (e) => {
      // console.log(eventNames.SUB_PAGE_CONTAINER.description, e.detail);
      if (this.routes[e.detail.route]) {
        this.routes[e.detail.route].container = e.detail.container;
      }
    });

    window.addEventListener(eventNames.NAVIGATE_SUB_PAGE.description, (e) => {
      console.log(`... received sub-navigation event: ${JSON.stringify(e.detail)}`);
      const path = e.detail.path;
      const elements = path.split("/");
      const elementsNum = elements.length;
      console.log(elements, elementsNum);

      const parent = `/${elements[elementsNum - 2]}`;
      const parentRoute = this.routes[parent];
      const child = `/${elements[elementsNum - 1]}`;
      const childRoute = this.routes[child];
      console.log(parentRoute, childRoute);
      if (!parentRoute || !childRoute) {
        console.error(`parent[${e.detail.parent}]/child[${e.detail.child}] not found...`);
        return;
      }

      parentRoute.container.innerHTML = childRoute.content;
      this.updateMetadata(childRoute);
      if (e.detail.pushState) {
        window.history.pushState({}, '', child);
      }
    });
  }

  navigateTo(path, pushState = true, stateData = {}) {
    // console.log(`navigateTo(${path}, ${pushState}, ${JSON.stringify(stateData)})`);
    const route = this.routes[path] || this.routes['/404'];
    this.container.innerHTML = route.content;
    this.updateMetadata(route);
    if (pushState) {
      window.history.pushState({}, '', path);
    }
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

  updateMetadata(route) {
    document.title = route.title;
    document.querySelector('meta[name="description"]').setAttribute('content', route.description);
    this.updateCanonicalUrl(route.canonicalUrl);
    this.updateStructuredData(route.structuredData);
  }

  updateStructuredData(data) {
    // https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
    // https://developers.google.com/search/docs/appearance/structured-data/search-gallery
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
