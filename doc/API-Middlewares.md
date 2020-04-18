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
- have their actions and behave as a 3rd party libraries

## Write your middleware as 3rd party

Middlewares in Dynadux can `dispatch` anything out of the box, without additional Thunk middlewares as Redux needs. 

You can write your middlewares that it is only a function that returns an `IDynaduxMiddleware`.

The user of the middleware will have to load only the middleware function in Dynadux's `middlewares` array prop only without the need to register reducers _like in Redux_!

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

Below are the interfaces of the `before` and `after` callbacks. They are the same as the Reducers callbacks! 
The only difference is the `after` callback has the `initialState` prop where is the version of the state before the dispatch of the action.
```
interface IDynaduxMiddlewareBeforeAPI<TState, TPayload> {
  action: string;
  payload: any;
  dispatch: TDynaduxMiddlewareDispatch<TPayload>;
  state: TState;
}

interface IDynaduxMiddlewareAfterAPI<TState, TPayload> {
  action: string;
  payload: any;
  reducerElapsedMs: number;
  dispatch: TDynaduxMiddlewareDispatch<TPayload>;
  state: TState;
  changed: boolean;*
  initialState: TState;
}

type TDynaduxDispatch<TPayload = any> = <TPayload>(action: string, payload: TPayload) => void;
```

**Note!** The `changed` indicates if the state is changed by the Middlewares and Reducer so far! The state might be changed by the rest loaded Middlewares. 

## Implementing a middleware

On Store's initialization, the middleware gets the reference of the Store, 
so it has access to the initial state and the `dispatch` method. 
This is done through the `init` callback property.  

The middleware is acting before the dispatch of the action and/or after the dispatch of the action.

On `before`, you can prepare the state, or enrich the payload.

On `after`, _the most useful one_, you can react to the dispatched action. 
On `after`, you have the `initialState` additionally, and you can compare what the action's reducer did. 

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

Middleware's Sub-Store eventually will update a part of the Parent Store where they added. 

Technically on Sub-Store's `onChange`, it will `dispatch` on the parent Store.

# Examples

#### Logger

This middleware consoles the action that has dispatched.
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

Dynadux shipped with a small middleware for debugging. For how to use it read next chapter [Debugging](doc/API-Debugging.md)

Curious, how is implemented? Check it [here](https://github.com/aneldev/dynadux/blob/master/src/middlewares/dynaduxDebugMiddleware.ts).

#### Dynadux History Middleware

Middlewares can have their actions.

A live example is the [dynadux-history-middleware](https://github.com/aneldev/dynadux-history-middleware). 
The full implementation is in [this file](https://github.com/aneldev/dynadux-history-middleware/blob/master/src/dynaduxHistoryMiddleware.ts).

Here, it is easy to make a History State management, navigating back and forth in time and offering **restore points**!

# Continue

[⬅️ Reducers](../README.md) 🔶 [Sections ➡️](doc/API-Sections.md) 

[🏠 Home, Contents](../README.md#table-of-contents)
