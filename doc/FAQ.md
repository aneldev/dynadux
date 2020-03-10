[🔙 Back to the main page](../README.md)

# Dynadux - FAQ

## What is a Dynadux Store

Dynadux Store is the return of the `createStore` [read here for more](./CreateStore.md) and is an object with two props: `state` getter and `dispatch` function.

## How many states have a Dynadux Store

One.

If you come from Redux, in Redux we have A Store with multiple States (root properties). 
In Dynadux we have one Store, with one State and the root props would be considered App's Section States.

## What is Business Store

It is created by a function, that wraps a Dynadux store and as a result, is a bunch of getters and functions that accessing the Dynadux store.

Business Stores are developed by you. Dynadux is the state manager, the engine,  of these stores. 

The Business Stores concept is introduced for the first time by Dynadux's approach in this repo.

## Why not use Provider and React's context

Dynadux doesn't provide a [Provider](https://reactjs.org/docs/context.html)... at least not now. You are free to make one and share it to open source.

Dynadux is made to create from small to large scale multiple and reusable State Managers. 

Provider tents to promote one State Management that makes the app a kind of monolithic.

The idea is to pass to the children what they need and not a global context. So it is not a good practice to pass the whole `store` but break it down and provide only what is needed! In this way, you will have small self-contained components without the context’s dependency. Your application would be split easily into small parts.

But again it's up to you if you want to make a global store with a provider. Dynadux won't complain. 

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
- [Advanced](./Advanced.md) Dispached promises, boost up your app and more.
- [Terminology](./Terminology.md) Terminology of dynadux, (is small!).
- [History, Undo/Redo middleware](https://github.com/aneldev/dynadux-history-middleware) Middleware for History, Undo/Redo and Restore Points.
