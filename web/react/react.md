# React

## Hooks

- Hooks can only be used within functional components.
- Hooks must always run in the same order when the component is invoked.
  - This means that hooks usually need to exist in the top level.

### Specific Hooks

- `useState`: Sets a value in state to be used.
  - Always returns an array of two objects, the value itself and its setter.
  - The initial value is given as a param to useState's constructor. It can be a value or an anonymous function.
    - The initial value is called every time the state is called, so avoid using calculations or functions in the useState constructor.
    - The anonymous function is called only once, when the component is rendered.
  - When the setter is called, the full object is replaced.
    - Because of this, it's better to split the state in multiple primitives with independent useState's.

```ts
// Value in constructor
const [count, setCount] = useState(0);

// Anonymous function in constructor
const [count, setCount] = useState(() => { return 0; });

// Object in state
const [state, setState] = useState({ count: 0, colour: 'Blue' });
const count = state.count;
const colour = state.colour;

function changeCount(mod: int) -> Void {
  setState(prevState => {
    return { ...prevState, count: prevState.count + mod };
  })
}
```

- `useEffect`: The most general side-effect handler for when some data changes.
  - A function within the hook can `return` some cleanup code.
    - Due to that, event listeners set within the hook should be unset in the hook's return function.

```ts
// basic usage
const [resourceType, setResourceType] = useState('post');

useEffect(() => {
  // ... side effects here are triggered when the `resourceType` changes
}, [resourceType])

// mount/unmount event listener
const [windowWidth, setWindowWidth] = useState(window.innerWidth);

const handleResize = () => {
  setWindowWidth(window.innerWidth);
}

useEffect(() => {
  window.addEventListener('resize', handleResize);

  return () => {
    window.removeEventListener('resize', handleResize);
  }
}, []);
```

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

- `useEffectEvent` (experimental):
- `useEffectActionState` (experimental):
- `useEffectOptimistic` (experimental):
- Custom Hooks:
