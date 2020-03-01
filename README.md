# About Dynadux

Advanced and simpler Stores based on Reducers (like Redux).

Dynadux is reducing the Redux's cumbersome.

Decoupled from React, can be used in NodeJs and React Apps without additional library. [See the live examples](./doc/Examples.md).

# How it works?

In general 
- you dispatch actions
- Dynadux is calling the reducers and middlewares
- Dynadux is calling the onChange callback


# Benefits to work with Dynadux against classic setState

- Reusable State Management.
- The use of pure reducer functions.
- Centralizing the state makes.
- Debuggable.
- History of the changes.

# Benefits against Redux

If you are familiar with Redux these are the benefits you gain with Dynadux.

- Dynadux creates stores with extremely smaller effort. No complementary libs are required.
- React Containers are React components, this enriches the life circly of the containers. 
- You can dispatch from containers at any time (not only on Redux's map times).
- Containers would be omitted! Dynadux's approach simplifies the use of the `store`!
- Create easily multiple stores, every component would have it's own store.
- You can wrap easily a Store and transform it to React Hook.
- Small stores means smaller parts of the app are rendered.
- Is faster because is calls the related reducer and not all of them.
- It encourages you to create business logic methods and not dispatchers.
- Much simpler and richer API for reducers and middlewares.
- No need for Thunk! `dispatch` is provided for all reducers and middlewares.
- Middlewares have callbacks for before and after the disparch of the action.
- Dynadux implementation is super simple, it is only an `Object.assign()`.
- No need to read tons of documentation, just this text is enough to learn it.
- Easier tests, kust mock network requests of the actions, not the store itself.
- Written in Typescript, supports types.

# Import
```
import {createStore} from "dynadux";
```

# Example to create a store
This is a state management to add and remove todo items.

```
const actions = {
  ADD_TODO: 'ADD_TODO',
  REMOVE_TODO: 'REMOVE_TODO',
};

const store = createStore({
    initialState: {
        todos: [],
    },
    reducers: {
          [actions.ADD_TODO]: ({state, payload}) => {
            return {
              ...state,
              todos: state.todos.concat(payload),
            };
          },
          [actions.REMOVE_TODO]: ({state, payload: todoId}) => {
            return {
              ...state,
              todos: state.todos.filter(todo => todo.id !== todoId),
            };
          },
    },
    onChange: (state) => console.log('State changed:', state),
});

```
Now lets add a todo
```
store.dispatch(actions.ADD_TODO, {id: '234', label: 'Drink beers'}});
```
Let's remove this todo
```
store.dispatch(actions.REMOVE_TODO, '234');
```
On every change the `onChange` will be called with the above code will be consoled.

# Create business logic stores and methods

> Note: this is a suggestion, is not mandatory.

It is nice to have a store and dispatching actions, but we can do something more.

## The principals

- wrap the store of Dynadux
- return a getter for the state
- return business logic methods that is using the store
- do not expose the dispatch but expose methods that are dispatching actions
- do not expose the store to ensure that the store is handled properly

```
const createTodoAppStore = (onChange) => {
    const store = createStore({
        initialState: {
            todos: [],
        },
        reducers: {
              [actions.ADD_TODO]: ({state, payload}) => {
                return {
                  ...state,
                  todos: state.todos.concat(payload),
                };
              },
              [actions.REMOVE_TODO]: ({state, payload: todoId}) => {
                return {
                  ...state,
                  todos: state.todos.filter(todo => todo.id !== todoId),
                };
              },
        },
        onChange,
    });

    return {
        get state() { return store.state; },
        addTodo: (todo) => store.dispatch<ITodo>(actions.ADD_TODO, todo),
        removeTodo: (todoId) => store.dispatch<string>(actions.REMOVE_TODO, todoId),
    };
};

```
This is a function that creates the store and provides business logic methods. The `addTodo` & the `removeTodo`.

## Use the "app" store

Now our `store` it won't the direct the `dynadux` store but a more sophisticated one.  

```
const store = createTodoAppStore(state => console.log('State change:', state));

```

And we can add a todo in more business oriented way.

```
store.addTodo({id: '121', label: 'Drink beers'});
```

For React components the store would instantiated like this on constructor.
```
const store = createTodoAppStore(this.setState.bind(this));

```
Then pass the `store` to the children components and use the `store.state` as state.

It is not needed to pass the entire store to the children, pass only what is needed.

# How to use it in React apps/components

1. Create a `createAppStore` method like the `createTodoAppStore` above.
2. On the constructor of the app component call this `this.store = createAppStore(this.setState.bind(this))`.
3. In the componets use the `this.store.state` as state
4. Use the exposed methods of the `this.store` to change the state

Check out the [A Todo app (React app)](https://codesandbox.io/s/sleepy-browser-mijt6) example.

# Examples

**Small and live examples.**

Briefly here are a couple.

- [The counter (React app)](https://codesandbox.io/s/amazing-bohr-xzhp0)

- [A Todo app (React app)](https://codesandbox.io/s/sleepy-browser-mijt6)

[All examples](./doc/Examples.md), all of them would be compared with redux versions of them.  

# API of Dynadux

## createStore method

This method create a store. A store is a State.

As param requires an object of the IDynaduxConfig interface.

The configuration of the store is only this object, action/reducers and middlewares. 

```
interface IDynaduxConfig<TState> {
  initialState?: TState;
  reducers: {
    [actionName: string]: TDynaduxReducer<TState, any>;
  };
  middlewares?: IDynaduxMiddleware<any, any>[];
  onChange?: (state: TState) => void;
}
```
What is required are the reducers.

They called on Action's dispatch. Only the referenced reducer is called and not all of them.

The return of the `createStore` are two properties only
- `state` a getter to get the current state
- `dispatch(action, payload)` method to dispatch actions

This simple API makes the Dynadux simple to fit it anywhere.

## `state` method

A getter to get the current state.

## `dispatch` method

### About

Dispatches an action, technically calls a reducer.

The `dispatch` is provided by

- the store
- the reducer callback
- the middleware callback

### `dispatch` method signature

In Plain form:
```
dispatch(action, payload)
```
In Typescript form:
```
type TDynaduxDispatch<TPayload = any> = <TPayload>(action: string, payload?: TPayload) => void;
```

The dispatcher is a simple method that with 2 arguments.

- 1st is request, the action, where is a string
- 2nd is the payload, optional, would be anything, string, number, object, null. 


### Example

```
store.dispatch(action.USER_LOGIN, userInfo);
store.dispatch(action.USER_LOGOFF);
```

## Reducer

### About

When an action is triggered, a reducer is called.

The reducer should return the new state of the store.

A reducer might call other reducers to update parts of the state. 

Reducers are changing the state when they called.

Reducers cannot be added on a later time. This makes our store always predictable from the starting point. You can add unlimited reducers/actions.

An action is not really dispatched to all reducers and this helps to avoid to make monolithic reducers. 

If you want ot share an info you should share it wisely from the state and not through dispatched actions.

### Dispatch from a reducer

Your reducer is called with an object several goodies. _The reference if of the API is few lines below._

One of them is the `dispatch` method where is exaclty the same with one of the store's.

Example: Fetch something from network and update the state


```
reducers: {
      [actions.GET_INFO_REQUEST]: ({state, dispatch}) => {
      
        fetch('http://www.example.com/api/beer-info')
            .then(info => dispatch(actions.GET_INFO_RESPONSE, info))
            .catch(error => dispatch(actions.GET_INFO_ERROR, error));
            
        return state;   // return always the state
      },
},
```

The call of the reducer is always synchronous, it should it return always the state.
This is what we did in the example.

When the fetch is fulfilled, it will dispatch the GET_INFO_RESPONSE or the GET_INFO_ERROR action.

### Split the work of reducer

_...soonish_

### API

```
type TDynaduxReducer<TState, TPayload> = (params: IDynaduxReducerAPI<TState, TPayload>) => Partial<TState>;

interface IDynaduxReducerAPI<TState, TPayload> {
  action: string;
  payload: any;
  dispatch: TDynaduxDispatch<TPayload>;
  state: TState;
}
```

### Examples

_...soonish_

## Middlewares

### About

Middlewares in Dynadux are helpful
- to prepare, maintain, decorate, clean up the state before or after action's dispatch
- for debugging
- monitor the state
- dispatch other 'parallel' actions
- send stats
- inspect suspicious dispatches

### Are always Synchronous

Middlewarea are execute synchronously and not asynchronously like Redux.
This is done intentionally to avoid complex and wrong implementations.

If you wanna for instance fetch User's info, it is better to do it with actions instead of Middlewares. 
Also complex network requests should be in an action instead on multiple middlewares.

### When are called

Would called before and or after dispatch of any action.

_...soonish_

### API

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
  before?: (reducerAPI: IDynaduxMiddlewareBeforeAPI<TState, TPayload>) => Partial<TState>;
  after?: (reducerAPI: IDynaduxMiddlewareAfterAPI<TState, TPayload>) => Partial<TState>;
}

```
### Examples

Super simple.

_...soonish_
```
const store = createStore({
    initialState: {
        todos: [],
    },
    middlewares: [
        () => {
        },
    ],
```

A live example is the [dynaduxDebugMiddleware](./src/middlewares/dynaduxDebugMiddleware.ts) is a debugging middleware to monitor what is dispatched.
This is used in [this test](tests/scripts/middleware.test.ts).

Read below how to use it.

# Debugging

## dynaduxDebugMiddleware

Dynandax is comming with middleware for debugging.

### Usage

```
import {createStore, dynaduxDebugMiddleware} from "dynadux";

const store = createStore({
    initialState: {
        todos: [],
    },
    middlewares: [
        dynaduxDebugMiddleware(),
    ],
    reducers: {
        // ...
    },
});

```

`dynaduxDebugMiddleware` adds to global array variable `dynaduxDebugMiddleware` all the dispatched items.

This middleware, as many other debugging tools, should not be on production since would lead to memory leak.

### API of dynaduxDebugMiddleware

As argument accepts a config object with this interface.

```
interface IDynaduxDebugMiddlewareConfig {
  globalVariableName?: string;
}
```

#### globalVariableName

When you work with mulitiple store it makes sense to save debugging info of the `dynaduxDebugMiddleware` in different global variables.

To load the middleware and save the array in different global name, for instance `debugState`, we can create the middleware like this:

`dynaduxDebugMiddleware({ globalVariableName: 'debugState '})`

# Dynadux's Architecture

Dynadux is very simple library. Technically the Dynadux is only an 

`Object.assign({}, state, middleware.before(), reducer(), middleware.before(),)`

and nothing else. 

What makes to be easy to use and powerful is the architecture described in this text.

# What you can read also

- [FAQ](./doc/FAQ.md)