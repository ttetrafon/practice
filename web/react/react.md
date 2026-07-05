# React

## Hooks

- `useState`:
- `useEffect`:
- `useContext`:
- `useRef`
- `useMemo`:
- `useCallback`:
- `useReducer`:
- `useTransition`:
- `useDeferredValue`:
- `useLayoutEffect`:
- `useDebugValue`:
- `useImperativeValue`:
- `useId`:
- `useSyncExternalStore`: Hooks into an external store (like the browser's `navigator`). Generally, very useful when interfacing with the browser's features.

```ts
const isOnline = useSyncExternalStore(subscribe, () => navigator.online);

function subscribe(cb: () => void) {
  window.addEventListener('offline', cb);
  window.addEventListener('online', cb);

  return () => {
    window.removeEventListener('offline', cb);
    window.removeEventListener('online', cb);
  }
}
```

```ts
// For example, the following will return the (open/closed) state of the modal as taken from the browser itself, so there is no need to keep track of its state manually through all relevant events that open/close a modal.
const modalRef = userRef<HTMLDialogElement>(null);
const isOpen = useSyncExternalStore(
  subscribe,
  () => {
    return modalRef.current?.open ?? false;
  },
  () => false // NOTE: The third parameter is used when rendering on the server.
);

function subscribe(cb: () => void) {
  modalRef.current?.addEventListener("toggle", cb);

  return () => {
    modalRef.current?.removeEventListener("toggle", cb);
  }
}
```

- `useEffectEvent` (exp):
- `useEffectActionState` (exp):
- `useEffectOptimistic` (exp):
- Custom Hooks:
