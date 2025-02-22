export class Navigator {
  constructor(containerId) {
    this.container = document.querySelector(containerId);

    this.routes = {
      '/': {
        content: '<page-one></page-one>',
        title: 'Page 1',
        description: 'This is page one!',
        canonicalUrl: 'https://myapp.com/page-one',
        structuredData: {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Page One",
          "description": "This is the first page of my app.",
          "url": "https://myapp.com/page-one"
        }
      },
      '/page-one': {
        content: '<page-one></page-one>',
        title: 'Page 1',
        description: 'This is page one!',
        canonicalUrl: 'https://myapp.com/page-one',
        structuredData: {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Page One",
          "description": "This is the first page of my app.",
          "url": "https://myapp.com/page-one"
        }
      },
      '/page-two': {
        content: '<page-two></page-two>',
        title: 'Page 2',
        description: 'This is page two!',
        canonicalUrl: 'https://myapp.com/page-two',
        structuredData: {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Page Two",
          "description": "This is the second page of my app.",
          "url": "https://myapp.com/page-two"
        }
      },
      '/404': {
        content: '<h1>Page Not Found</h1>',
        title: 'Page not found',
        description: 'The page you request was not found!',
        canonicalUrl: 'https://myapp.com/404',
        structuredData: {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "404 - Page Not Found",
          "description": "The page you are looking for does not exist.",
          "url": "https://myapp.com/404"
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
    window.addEventListener('navigate', (e) => {
      console.log(`... received navigation event: ${JSON.stringify(e.detail)}`);
      this.navigateTo(e.detail.target, true, e.detail.data ? e.detail.data : {});
    });
  }

  navigateTo(path, pushState = true, stateData = {}) {
    console.log(`navigateTo(${path}, ${pushState}, ${JSON.stringify(stateData)})`);
    const route = this.routes[path] || this.routes['/404'];

    // update contents
    this.container.innerHTML = route.content;

    // update metadata
    document.title = route.title;
    document.querySelector('meta[name="description"]').setAttribute('content', route.description);
    this.updateCanonicalUrl(route.canonicalUrl);
    this.updateStructuredData(route.structuredData);

    // Update the URL and history stack
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
