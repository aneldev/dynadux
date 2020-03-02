# FAQ

## Why not use Provider and React's context

Dynadux doesn't provide a [Provider](https://reactjs.org/docs/context.html)... at least not now. You are free to make one and share it to open source.

Dynadux is made to create from small to large scale multiple and reusable State Managers. 

A Provider tents to promote one State Management that makes the app a kind of monolithic.

The idea is to pass to the children what they need and not a global context. So it is not a good practice to pass the whole `store` but break it down and provide only what it is needed! In this way you will have small self contained components without the context’s dependency. Your application would be splitted easily into small parts.

## Why reducers and middlewares don't accept Promises

There is only one reason: Performance. 

No, the promises are not slow, but they add an effort that is not needed most of the time!

In reality, promises are useful when we have asynchronous operations. 

Back to the state management, this is needed when we have network or expensive operations.

If Dynadux had to support Promised results from reducers and middlewares it will add more process effort for all results and for those that are not promised results. _Remember that actions should be serialized._

A state manager should be fast, especially when the dispatches are intensive and have to update sensitive UIs like the React components.

**But this doesn't mean that Dynadux does not support async operations**, on the contrary it offers you the `dispatch` for reducers and middlewares out of the box (without the need of a Thunk or other helper middlewares as in Redux).

Dynadux encourages you to write your own Promised methods and use them in the reducers like this: 
```
reducers: {
      [actions.LOGIN]: ({state, dispatch, payload: {name, psw} }) => {
      
        loginUser(name, psw) // <- your async method
            .then(info => dispatch(actions.LOGIN_SUCCESS))
            .catch(error => dispatch(actions.LOGIN_DAILED, error));
            
        return state;   // return always the state
      },
},
```

Or in modern `async` way

```
reducers: {
      [actions.LOGIN]: ({state, dispatch, payload: {name, psw} }) => {
        (async () => {  // make an async closure to use the await
            try {
                await loginUser(name, psw);
                dispatch(actions.LOGIN_SUCCESS);
            } catch(error) {
                dispatch(actions.LOGIN_DAILED, error);
            }
        })();

        return state;   // return always the state
      },
},
```
Personal preference… the `().then().catch()` pattern looks simpler!

