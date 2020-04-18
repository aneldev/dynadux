[🏠 Home](../README.md)

# Dynadux - Redux

# How to use it in React apps/components

1. Create a `createAppStore`
2. On the body of the class declare `store = createAppStore(() => this.setState({}))`.
3. In the components use the `this.store.state` getter as a state or what ever your Business Store returns as State.
4. Use the exposed methods of the `this.store` to change the state

[Check out the Cart example](https://codesandbox.io/s/awesome-wozniak)

[See all examples](./Examples.md)

# How to make a Business Store React Hook

#### Our store

Imagine this business store.

```
const businessStore = (onChange) => {
  const store = createStore({
    onChange,
    initialState: {...},
    reducers: {...},
  })
  
  return {
    get state() { return store.state; },
    actions: {
      addTodo: todo => dispatch(...),
      removeTodo: id => dispatch(...),
    }
  }
} 

```

#### Convert the store to hook 
_In Typescript_

```
const useBusinessStore = () => {
  const [s, forceUpdate] = useState({});
  const appStoreRef = useRef<any>();

  return (
    appStoreRef.current
    || (
      appStoreRef.current = businessStore(() => forceUpdate({}))
    )
  ) as ReturnType<typeof businessStore>;;
};

```

We use the `useRef` of React to hold our store. On the first call, since it doesn't exist, we create it and save it to the `appStoreRef`.

When our Store has a change, we call the `setState({})` where this triggers the `render` of the component. 

The above hook returns the Business Store's API, the return of the `businessStore` function above.

**You don't have to implement anything else in the hook!** The above code is just a converter. 

> For typescript, there is no need to pass any interface, the hook gets the Business Store return type explicitly.

#### Use the business store as a hook 

Use the hook.

```
const MyComponent = () => {
  const {
    state,
    actions,
  } = useBusinessStore();
  
  return (
    <div>
      {state.todos.map(...)}
      <button
        onClick={() => actions.addTodo(...)}
      >Add todo</button>
    </div>
  );
}
```

# How to use it with Provider

Since v2.2.0 we have the [react-dynadux](https://github.com/aneldev/react-dynadux).

Some nice features for small or large react applications
- Any component can be connected without pass the store directly
- Reduces the global renderings since it renders only the connected components

With react-dynadux, there are some more benefits
- It "publishes" any App Store and not the state
- On component's connection, there is a callback to control the render according to the dispatched `action` & `payload` 

Check out the [react-dynadux](https://github.com/aneldev/react-dynadux) how to use it, it is super simple.

# Read more 

- [FAQ](./FAQ.md) Frequently asked questions
- [Examples](./Examples.md) Live examples. Examples compared to redux's implementations
- [Sections](./API-Sections.md) Create sections for applications or big components
- [Advanced](./Advanced.md) Dispached promises, boost up your app and more
- [Typescript](./doc/Typescript.md) Tips for Typescript implementations
- [Terminology](./Terminology.md) Terminology of dynadux, (is small!)
- [History, Undo/Redo](https://github.com/aneldev/dynadux-history-middleware) Middleware for History, Undo/Redo and Restore Points
- [React Dynadux](https://github.com/aneldev/react-dynadux) Provider for Dynadux App Stores
- [Changelog](./Changelog.md) Changes of Dynadux per semver version
- [🏠 Home, Contents](../README.md#table-of-contents)

