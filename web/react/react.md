# React

## Context

- A context class is used to supply context values to all enclosed elements.

```ts
import { createContext, useContext, type ReactNode } from "react";

interface AppContextType {
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);

  return (
    <AppContext.Provider value={{ /* context methods & values */ loading, setLoading }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
```

- A context can be called within any child element so its methods and values can be called.

```ts
import { useAppContext } from "~/context/AppContext";

export default function Loader() {
  const { loading } = useLoading();

  return (
    <>
      {loading && <div id='loader-parent'>
        <span id='loader'></span>
      </div>}
    </>
  );
}
```

```html
<AppProvider>
  <body>
    <!-- ... -->
    <loader />
  </body>
</AppProvider>
```

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
  - If a useEffect is not given a list of observables, it will be triggered only when the element is (re)rendered.

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

- `useContext`: Used to call any enclosing context directly for values and/or methods.
  - If using a provider, useContext is instead called within a custom hook and the custom hook is called in the element(s).

```ts
const darkThem = useContext(ThemeContext);
```

- `useRef`: Holds a value, which persist between component rerenders.
  - Creates an object holding the given value (e.g.: `useRef(0)` results in `{ current: 0 }`).
    - Changing its value does not trigger a state update, so it does not trigger a component rerender.
    - Because of this, it's useful as a tool to store previous some previous state.
  - Can also be used to hold references to html elements and react components.
    - All html elements have a `ref` property defined for this.

```ts
const count = useRef(0);
const incrementCount = () => {
  count.current = count.current + 1;
}

// Element reference
const inputRef = useRef();

return (
  <input ref={inputRef} ...>
);
```

- `useMemo`: Used to cache the value so it is not recomputed each time the component rerenders.
  - Creates a map of `input(s) -> value` and stores it for later.
  - `useMemo` has a time and memory overhead, so it should not be used in place of `useEffect` everywhere.

```ts
const [number, setNumber] = useState(0);

const memoisedResult = useMemo(() => {
  return someSlowFunction(number);
}, [number]);
```

- `useCallback`: Similar to `useMemo`, but used with functions (usually with inputs), as it returns the function itself, not just its returned value like `useMemo` does.

```ts
const [number, setNumber] = useState(0);

const getItems = useCallback((increment, multiplier) => {
  return [number, number + increment, number * multiplier];
}, [number]);
```

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
