# Navigator

## Functional Members

### Clipboard

- Provides access to the device's clipboard.

```js
await navigator.clipboard.writeText("This is some 'copied' text!.");
```

### Locks

- A lock is a method to keep functionality from running multiple times simultaneously.

```js
const controller = new AbortController();

await navigator.locks.request(
  "example-lock",
  {
    ifAvailable: true,
    // true: If not available, fails immediately.
    // false: If not available, waits until released.
    mode: 'exclusive', // 'shared'
    signal: controller.signal // Can abort with controller.abort()
  },
  lock => {
    // do not execute if there is a lock (runs if isAvailable === true)
    if (!lock) return;

    // ... do stuff
  }
);

const snapshot = await navigator.locks.query() // returns all current locks
// snapshot.held: locks currently running
// snapshot.pending: locks waiting for execution
```

### Share

- Triggers native share functionality on the device.

```js
navigator.share?.({ title: document.title, url: location.href });
```

### Screen Lock

- Keeps the screen from turning off.

```js
// start the lock
const wakeLock = await navigator.wakeLock.request("screen");

// release the lock
wakeLock.release();
```

### Vibrate

- Triggers native vibration functionality on the device.
- Only available on _Chromium_.

```js
navigator.vibrate?.(
  200 // ms
);

navigator.vibrate?.(
  [500, 100, 500] // 500ms, 100ms, then 500ms again
);
```
