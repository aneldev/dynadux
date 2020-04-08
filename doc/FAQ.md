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

## Why not use Provider and React's context

Dynadux doesn't provide a [Provider](https://reactjs.org/docs/context.html)... at least not now. You are free to make one and share it to open source.

Dynadux is to create from small to large scale multiple and reusable State Managers. 

Provider promotes one State Management that makes the app a monolithic.

The idea is to pass to the children what they need and not the entire store. So it is not a good practice to give the whole `store` but break it down and only provide what is needed! In this way, you will have small self-contained components without the context’s dependency. Your application would be split easily into small parts.

But again, it's up to you if you want to make a global store with a provider. Dynadux won't complain. Dynadux is so small that it can fit anywhere.

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
- [History, Undo/Redo middleware](https://github.com/aneldev/dynadux-history-middleware) Middleware for History, Undo/Redo and Restore Points
- [Changelog](./Changelog.md) Changes of Dynadux per semver version
- [🏠 Home, Contents](../README.md#table-of-contents)
