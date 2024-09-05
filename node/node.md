# nodejs

## CLI

- npm init: starts a node project
- npm install package_name --save: adds the package_name as a dependency
- npm install package_name --save-dev: adds the package_name as a dev dependency
- npm outdated: lists packages that can be updated in the project
  - Versions are defined as X.Y.Z
    - X: major - to allow major updates define a package version as '*' or 'x'
    - Y: minor - to allow minor updates define a package version as '1' or '1.x' or '^1.0.4'
    - Z: patch - to allow patch updates define a package version as '1.0' or '1.0.x' or '~1.0.4'

- npm list -g: lists all packages installed in root
- npm list: lists all packages installed in the current project

## Memory Management

- Links:
  - [Common Causes of Memory Leans in JavaScript](https://www.trevorlasn.com/blog/common-causes-of-memory-leaks-in-javascript)
- Always remove event listeners, as their references to functions and variables remain indefinitely in memory.

```js
const EventEmitter = require('events');
const myEmitter = new EventEmitter();

function listener() {
    console.log('Event triggered!');
}

// Add an event listener
myEmitter.on('event', listener);

// Trigger the event and then remove the listener
myEmitter.emit('event');
myEmitter.removeListener('event', listener);

// Alternatively, you can use `once` method to add a listener that automatically removes itself after being triggered
myEmitter.once('event', listener);
```

- Use [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap), [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet), and [`WeakRef`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakRef) when needed, especially when creating circular references between objects.
  - These are mainly needed when handling caches or bid data.
