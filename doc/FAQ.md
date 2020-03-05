# FAQ

## Why not use Provider and React's context

Dynadux doesn't provide a [Provider](https://reactjs.org/docs/context.html)... at least not now. You are free to make one and share it to open source.

Dynadux is made to create from small to large scale multiple and reusable State Managers. 

A Provider tents to promote one State Management that makes the app a kind of monolithic.

The idea is to pass to the children what they need and not a global context. So it is not a good practice to pass the whole `store` but break it down and provide only what it is needed! In this way you will have small self contained components without the context’s dependency. Your application would be splitted easily into small parts.

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

