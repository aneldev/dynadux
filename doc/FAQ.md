[🏠 Home](../README.md)

# Dynadux - FAQ

## What is a Dynadux Store

Dynadux Store is the return of the `createStore` [read here for more](./CreateStore.md) and is an object with two props: `state` getter and `dispatch` function.

## How many states have a Dynadux Store

One.

If you come from Redux, in Redux, we have A Store with multiple States (root properties). 
In Dynadux, we have one Store, with one State, and the root props would be considered App's Section States.

## What is Business Store
It is the return of a function that wraps a Dynadux store.  The return has getters and methods to be used by the application. These getters and methods are accessing the Dynadux store.

You develop business Stores. Dynadux is the state manager, the engine,  of these stores. 

The Business Stores concept introduced by Dynadux's approach in this repo.

## Does Dynadux has React Provider?

Since v2.2.0 it has, checkout the [dynadux-provider](https://github.com/aneldev/dynadux-provider).

Provider promotes one State Management that makes the app a monolithic. 

On the other hand, it offers some nice features for small or large react applications
- Any component can be connected without pass the store directly
- Reduces the global renderings since it renders only the connected components

With dynadux-provider, there are some more benefits
- It "publishes" any App Store and not the state
- On component's connection, there is a callback to control the render according to the dispatched `action` & `payload` 

## How to dispatch through a reducer

```
reducers: {
  [actions.LOGIN]: ({dispatch, payload: {name, psw} }) => {
    loginUser(name, psw) // <- your async method
      .then(info => dispatch(actions.LOGIN_SUCCESS))
      .catch(error => dispatch(actions.LOGIN_DAILED, error));
  },
},
```

Or in modern `async` way

```
reducers: {
  [actions.LOGIN]: ({dispatch, payload: {name, psw} }) => {
    (async () => {  // make an async closure to use the await
      try {
        await loginUser(name, psw);
        dispatch(actions.LOGIN_SUCCESS);
      } catch(error) {
        dispatch(actions.LOGIN_DAILED, error);
      }
    })();
  },
},
```

_Personal preference the `().then().catch()` pattern looks simpler!…

# Read more 

- [React](./React.md) How to use it in react
- [Examples](./Examples.md) Live examples. Examples compared to redux's implementations
- [Sections](./Sections.md) Create sections for applications or big components
- [Advanced](./Advanced.md) Dispached promises, boost up your app and more
- [Typescript](./doc/Typescript.md) Tips for Typescript implementations
- [Terminology](./Terminology.md) Terminology of dynadux, (is small!)
- [History, Undo/Redo](https://github.com/aneldev/dynadux-history-middleware) Middleware for History, Undo/Redo and Restore Points
- [React Provider](https://github.com/aneldev/dynadux-provider) React Provider for Dynadux App Stores
- [Changelog](./Changelog.md) Changes of Dynadux per semver version
- [🏠 Home, Contents](../README.md#table-of-contents)
