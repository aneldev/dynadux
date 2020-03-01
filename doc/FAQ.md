# FAQ

## Why not use Provider and React's context

Dynadux doesn't provide a [Provider](https://reactjs.org/docs/context.html)... at least for now. You are free to make one and share it.

Dynadux is made to create small to large scale mutiple and reusable State Managers. 

A Provider tents to promote one State Management that makes the app a kind of monolithic.

The idea is to pass to the children what they need. So is not good practice to pass either the whole `store` but break down and provide only what is needed!

## Why reducers and middlwares dont't accept Promises

There is only one reason: Performance. No, the promises are not show.

In real, promises are useful when we have asynchronous operations. 

Back to the state management this is needed when we have network or expensive operations.

If Dynadux had to support Promised results from reducers and middlewares it will add more process effort for all results and for those that are not promised results.

A state manager should be fast, especially when the dispatches are intensive and have to update a UI like the React compoenents.

**But this doesn't mean that Dynadux is not supporting async operations**, in opposite, it offers you the `dispatch` for reducers and middlawares out of the box (without the need of a Thunk or other helper middleware).

Dynadux encourages you to write your own Promised methods and used them in the reducers like this: 
```
reducers: {
      [actions.LOGIN]: ({state, dispatch, payload: {name, psw} }) => {
      
        loginUser(name, psw)
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
