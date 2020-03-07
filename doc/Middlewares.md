[🔙 Back to the main page](../README.md)

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

You can write your own middlewares that it is only a function that returns an `IDynaduxMiddleware` object _see next_.

The user of the middleware will have to load only the middleware function in Dynadux's `middlewares` array prop only, without need to register reducers _like in Redux_!

## Implementing a middleware

The middleware can be loaded before the dispatch of the action and/or after the dispatch of the action.

On the `before` phase, you can prepare the state, or enrich the payload.

On `after` phase, _the most useful one_, you can react to the dispatched action. On `after` phase you have additionally the `initialState` and you can compare what the action did. 

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

# API

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

interface IDynaduxMiddleware<TState = void, TPayload = void> {
  before?: (reducerAPI: IDynaduxMiddlewareBeforeAPI<TState, TPayload>) => undefined | void | Partial<TState>;
  after?: (reducerAPI: IDynaduxMiddlewareAfterAPI<TState, TPayload>) => undefined | void | Partial<TState>;
}

```
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
#### Collect dispatched actions for debugging

Dynadux is shipped with a small middleware for debugging, that it is implemented [here](https://github.com/aneldev/dynadux/blob/master/src/middlewares/dynaduxDebugMiddleware.ts).

The usage of it is described later.

#### Dynadux History Middleware

Middlewares can have their own actions.

A live example is the [dynadux-history-middleware](https://github.com/aneldev/dynadux-history-middleware). 
The whole implementation is in [this file](https://github.com/aneldev/dynadux-history-middleware/blob/master/src/dynaduxHistoryMiddleware.ts).

Here, it is easy to make a History State management, navigating back and forth in time and offering **restore points**!

# Continue

[⬅️ Reducers](../README.md) 🔶 [Debugging ➡️](./Debugging.md) 