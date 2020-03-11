[🏠 Home](../README.md)

# Dynadux - Middlewares

## About

With middlewares, you can
- prepare, maintain, decorate, clean up the state before or after action's dispatch
- create 3rd party middleware libraries, like, load the weather for a city, etc
- debugging, monitor the state
- dispatch other 'parallel' actions
- send usage stats

Middlewares can
- access the entire state
- access all dispatched actions from anywhere
- dispatch actions
- have their own actions and behave as a 3rd party libraries

## Write your own middleware as 3rd party

Middlewares in Dynadux can `dispatch` anything out of the box, without additional Thunk middlewares as Redux needs. 

You can write your own middlewares that it is only a function that returns an `IDynaduxMiddleware`.

The user of the middleware will have to load only the middleware function in Dynadux's `middlewares` array prop only, without need to register reducers _like in Redux_!

# API
The interface of what the middleware is:
```
interface IDynaduxMiddleware<TState = void, TPayload = void> {
  init?: (store: Dynadux<TState>) => void;
  before?: (reducerAPI: IDynaduxMiddlewareBeforeAPI<TState, TPayload>) => undefined | void | Partial<TState>;
  after?: (reducerAPI: IDynaduxMiddlewareAfterAPI<TState, TPayload>) => undefined | void | Partial<TState>;
}
```
Technically the middleware is an object of the above `init`, `before` and `after` callbacks.

All of them are optional.

Below are the interfaces of the `before` and `after` callbacks. Actually they are the same as the Reducers callbacks! 
The only difference is the `after` callback has the `initialState` prop where is the version of the state before the dispatch of the action.
```
interface IDynaduxMiddlewareBeforeAPI<TState, TPayload> {
  action: string;
  payload: any;
  dispatch: TDynaduxDispatch<TPayload>;
  state: TState;
}

interface IDynaduxMiddlewareAfterAPI<TState, TPayload> {
  action: string;
  payload: any;
  dispatch: TDynaduxDispatch<TPayload>;
  state: TState;
  initialState: TState;
}

type TDynaduxDispatch<TPayload = any> = <TPayload>(action: string, payload: TPayload) => void;
```

## Implementing a middleware

On Store's initialization, the middleware gets the reference of the Store, 
so it has access to the initial state and to the `dispatch` method. 
This is done through the `init` callback property.  

On the lifecycle, the middleware is acting before the dispatch of the action and/or after the dispatch of the action.

On `before`, you can prepare the state, or enrich the payload.

On `after`, _the most useful one_, you can react to the dispatched action. 
On `after` phase you have additionally the `initialState` and you can compare what the action did. 

The implementation of each phase may return a partial state or nothing for no state changes.

In both phases, you can access the 
- `action` (string)
- `payload`
- `state` (the entire state)
- `dispatch` method

The `initialState` is offered on `after` only.

This API is the same as the reducers. 
So, middlewares act like reducers. 

> Redux doesn’t have the `before` phase.

## Sub-Stores

Since the creation of the Store with Dynadux is super easy, complex middlewares would have their Store.
These are called Sub-Stores and have no relation with other stores. 

Middleware's Sub-Store eventually will update a part of the Parent Store where they are added. 

Technically on Sub-Store's `onChange` it will `dispatch` on parent Store.

# Examples

#### Logger

This middleware consoles the action that has been dispatched.
```
middlewares: [
  {
    after: ({action, payload}) => {
      console.log('dispatch', new Date, action, payload);
    },
  }
],

```

#### Send stats

```
middlewares: [
  {
    after: ({action, payload}) => {
      If (action === ‘USER-LOGIN-ERROR) {
        // post here there error, async
      }
    },
  }
],

```
#### Debugging middleware

Are you going to collect the dispatched actions for debugging? Well, it is already ready!

Dynadux is shipped with a small middleware for debugging. For how to use it read next chapter [Debugging](./Debugging.md)

Curious how is implemented? Check it [here](https://github.com/aneldev/dynadux/blob/master/src/middlewares/dynaduxDebugMiddleware.ts).

#### Dynadux History Middleware

Middlewares can have their own actions.

A live example is the [dynadux-history-middleware](https://github.com/aneldev/dynadux-history-middleware). 
The whole implementation is in [this file](https://github.com/aneldev/dynadux-history-middleware/blob/master/src/dynaduxHistoryMiddleware.ts).

Here, it is easy to make a History State management, navigating back and forth in time and offering **restore points**!

# Continue

[⬅️ Reducers](../README.md) 🔶 [Debugging ➡️](./Debugging.md) 

[🏠 Home, Contents](../README.md#table-of-contents)
