# Progressive Web Apps

* Native apps that can be deployed on different devices form a single code base.
* Development is done in HTML, CSS, and JS.
* Hosted on web-servers, but can be operated offline.
* Installed and accessed via a URL or distributed through app stores.
* Have access to operating system and hardware capabilities, unlike webpages.

Useful links:

* [PWA Feature Tracker](https://fugu-tracker.web.app/)
* [https://docs.pwabuilder.com](https://docs.pwabuilder.com)
* [#30DaysOfPwa](https://microsoft.github.io/win-student-devs/#/)
* [https://web.dev/](https://web.dev/)
* [https://learn.microsoft.com](https://learn.microsoft.com)
* [https://developer.mozilla.org](https://developer.mozilla.org)

## PWS Parts

* Manifest: Describes how the app integrates with the operating system.
* Service Worker (SW): Responsible for most of the app operation.
  * App <-> SW <-> Network / Cache
    * Cache can be used to store online data for offline use.
  * SW are usually operational even when the app itself is not, allowing for greater flexibility of when and how things happen.

## Integration Layers

* Web API Access
  * Web Assembly
  * Payment API
  * Media APIs
* Device Adaptation
* OS Integration
  * File handlers
  * Sharing information through the "share dialogue"
  * Badges
  * Widgets
* Offline Support
  * Cache implementation steps:
    1. Cache static resources first.
    2. Redirect to a custom offline page.
    3. Create more complicated offline scenarios.
    4. Cache resources and libraries.
