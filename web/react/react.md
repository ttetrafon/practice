# React

- [React developer reference](https://react.dev/reference/react)

## Components

### References

- All react components feature a `ref={}` property, which can be used with `const elementRef = useRef()` to access them in the code.
- Custom components can be assigned a ref through `React.forwardRef`.

```ts
import React from "react";

function CustomInput({ style, ...props }, ref) {
  return (
    <input
      ref={ref}
      {... props}
      style=({
        border: 'none',
        backgroundColor: 'lightpink',
        padding: '0.25em',
        ...style,
      })
    />
  );
};

export default React.forwardRef(CustomInput);
```

- For advanced control, `React.useImperativeHandle` can be used instead.
  - A function within the `useImperativeHandle's` return value will be exported and be available to be called where the element is referenced - like exposing methods in web-components.
  - The list of observables is used like in 'useEffect' to call the methods when any dependency changes.

```ts
import React, { useImperativeHandle } from "react";

function CustomInput({ style, ...props }, ref) {
  useImperativeHandle(ref, () => {
    return { alertHi: () => alert(`Hi ${props.value}!`) }
  }, [props.value]);

  return (
    <input
      {... props}
      style=({
        border: 'none',
        backgroundColor: 'lightpink',
        padding: '0.25em',
        ...style,
      })
    />
  );
};

export default React.forwardRef(CustomInput);
```

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

### Built-in Hooks

- [useState](https://react.dev/reference/react/useState): Sets a value in state to be used.
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

- [useEffect](https://react.dev/reference/react/useEffect): The most general side-effect handler for when some data changes.
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

- [useContext](https://react.dev/reference/react/useContext): Used to call any enclosing context directly for values and/or methods.
  - If using a provider, useContext is instead called within a custom hook and the custom hook is called in the element(s).

```ts
const darkThem = useContext(ThemeContext);
```

- [useRef](https://react.dev/reference/react/useRef): Holds a value, which persist between component rerenders.
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

- [useMemo](https://react.dev/reference/react/useMemo): Used to cache the value so it is not recomputed each time the component rerenders.
  - Creates a map of `input(s) -> value` and stores it for later.
  - `useMemo` has a time and memory overhead, so it should not be used in place of `useEffect` everywhere.

```ts
const [number, setNumber] = useState(0);

const memoisedResult = useMemo(() => {
  return someSlowFunction(number);
}, [number]);
```

- [useCallback](https://react.dev/reference/react/useCallback): Similar to `useMemo`, but used with functions (usually with inputs), as it returns the function itself, not just its returned value like `useMemo` does.

```ts
const [number, setNumber] = useState(0);

const getItems = useCallback((increment, multiplier) => {
  return [number, number + increment, number * multiplier];
}, [number]);
```

- [useReducer](https://react.dev/reference/react/useReducer): Useful for taking actions on complex state objects.

```ts
const [state, dispatch] = useReducer(reducer, { count: 0 });

function reducer(state: obj, action: obj) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + action.num };
    case 'decrement':
      return { count: state.count - action.num };
    case 'multiply':
      return { count: state.count * action.num };
    case 'divide':
      return { count: state.count / action.num };
    default:
      return state;
  }
}

function adjustCount(type: string, num: number) {
  dispatch(type);
}
```

- [useTransition](https://react.dev/reference/react/useTransition): Used for low-priority state changes, especially
  - when:
    - _a state change is slow_
    - _a state change happens very often, and can be deferred_
  - In such cases, `useTransition` updates the state when processing finishes without blocking the component's rerender.

```ts
const [isPending, startTransition] = useTransition();
// `isPending` keeps track of when `startTransition` is still processing.

function handleChange() {
  // ... some high priority processing

  // whatever is within startTransition stops is deferred if handleChange is called again or a rerender is triggered elsewhere
  startTransition(() => {
    // ... some processing
  });
}
```

- [useDeferredValue](https://react.dev/reference/react/useDeferredValue): Keeps the deferred value static until the application has time to update its value.
  - It's like debouncing with the delay calculated dynamically by React.

```ts
const deferredInputValue = useDeferredValue(input);
const res = useMemo(() => {
  // ... non-critical functionality depending on the deferred input
}, [deferredInput]);
```

- [useLayoutEffect](https://react.dev/reference/react/useLayoutEffect): synchronous `useEffect`
  - Useful when:
    - we need updates to happen synchronously with any changes the user performs.
    - changes affect the dom directly/indirectly and we need details from the dom to continue (e.g.: get a bounding box, an element's size, etc).
- [useImperativeHandle](https://react.dev/reference/react/useImperativeHandle): Used for better handling of references for custom components (see above).
- [useId](https://react.dev/reference/react/useId): Can be used to create unique element ids.
  - Note that:
    - an id will be random but always the same when created in the same rendered page.
    - these ids are invalid for `document.querySelector()` on purpose.
  - Tip: if multiple unique ids are needed within the same page, use `useId()` once and append some value to it each time it is used for an element.

```ts
default function EmailForm() {
  const id = useId();

  return (
    <>
      <label htmlFor={`{id}:email`}>Email</label>
      <input id={`{id}:email`} type="email" />

      <label htmlFor={`{id}:name`}>Name</label>
      <input id={`{id}:name`} type="text" />
    </>
  );
}
```

- [useSyncExternalStore](https://react.dev/reference/react/useSyncExternalStore): Hooks into an external store (like the browser's `navigator`). Generally, very useful when interfacing with the browser's features.

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

- [useEffectEvent](https://react.dev/reference/react/useEffectEvent): Used within `useEffect` (or other hooks) to separate some logic/functionality/value that must not be part of the effect dependencies.
  - `useEffectEvent` always reads the latest render state and the logic within is not _reactive_, it instead functions more like an event listener.

```ts
function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => { // This decouples the theme variable from the useEffect below, limiting the triggering of the connection when the theme changes.
    showNotification('Connected!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
}
```

- [useInsertionEffect](https://react.dev/reference/react/useInsertionEffect):
- [useOptimistic](https://react.dev/reference/react/useOptimistic): Updates the UI immediately.
  - The set function returned by useOptimistic lets you update the state for the duration of an Action. You can pass the next state directly, or a function that calculates it from the previous state.

```ts
const [optimisticLike, setOptimisticLike] = useOptimistic(false);
const [optimisticSubs, setOptimisticSubs] = useOptimistic(subs);

function handleClick() {
  startTransition(async () => {
    setOptimisticLike(true);
    setOptimisticSubs(a => a + 1);
    await saveChanges();
  });
}
```

- [useActionState](https://react.dev/reference/react/useActionState): Allows to update the state with side-effects using actions (i.e.: functions called within `startTransition`).

```ts
function reducerAction(previousState, actionPayload) {
  // ...
}

function MyCart({initialState}) {
  const [state, dispatchAction, isPending] = useActionState(reducerAction, initialState);
  // ...
}
```

- [useDebugValue](https://react.dev/reference/react/useDebugValue): Used with custom hooks to display any value next to its state in the console.
- [useFormStatus](https://react.dev/reference/react-dom/hooks/useFormStatus):
- Custom Hooks:
