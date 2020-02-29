# About Dynadux

Advanced and simpler Stores based on Reducers like Redux.

Dynadux is reducing the Redux's cumbersome.

Decoupled from React, can be used in NodeJs and React Apps without additional library.

# Benefits to work with Dynadux against classic setState

In general what you do it Discpatch actions and that call reducers to change the state.

- Reusable State Management
- The use of pure reducer functions
- Centralizing the state makes
- Debuggable
- History of the changes

# Benefits against Redux

If you are familiar with Redux these are the benefits you gain with Dynadux 

- Create stores with small configuration centralized
- React Containers can be plain React components
- You can dispatch from containers at any time, on only on Redux's map time
- Create easily multiple stores, every component can have it's own store
- You can wrap easily a Store and transform it to React Hook
- Small stores means smaller parts of the app are rendered
- Is faster because for an action call specific reducer and not all of them
- It guides you to create business logic methods and not dispatchers
- Much simpler and richer API for reducers and middlewares
- No need for Thunk! `dispatch` is provided for all reducers and middlewares
- Middlewares have callbacks for before and after the disparch of the action
- Dynadux implementation is super simple, 60 lines of actual code (in Dynadux.ts) and includes the middlewares
- No need to read tons of documentation, just this text is enough to learn it
- Easier tests, mock network requests of the actions, not the store itself
- Written in Typescript, supports types

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

# Create business store with logic methods

It is nice to have a store and dispatching actions, but we can do something more.

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

We can use it like this:

```
const store = createTodoAppStore(state => console.log('State change:', state));

```

And we can add a todo in more business logic way.

```
store.addTodo({id: '121', label: 'Drink beers'});
```

For React components the store would instantiated like this on constructor.
```
const store = createTodoAppStore(this.setState.bind(this));

```
Then pass the `store` to the children components and use the `store.state` as state.

It is not needed to pass the entire store to the children, pass only what is needed.

# Live examples

## [The counter](https://codesandbox.io/s/amazing-bohr-xzhp0)

## [A Todo app](https://codesandbox.io/s/sleepy-browser-mijt6)

[More examples](./doc/Examples.md)

# API

## createStore method

This method create a store. A store is a State.

At param requires a object of of IDynaduxConfig interface.

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

## `dispatch` method

### About

Dispatches an action, technically calls a reducer.

The `dispatch` is provided by

- the store
- the reducer callback
- the middleware callback

### API

```
export type TDynaduxDispatch<TPayload = any> = <TPayload>(action: string, payload?: TPayload) => void;
```

The dispatcher is a simple method that with 2 arguments.

- 1st is request, the action, where is a string
- 2nd is the payload, would be anything, string, number, object, null. 


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
            .then(info => dispatch(actions.actions.GET_INFO_RESPONSE, info))
            .catch(error => dispatch(actions.actions.GET_INFO_ERROR, error));
            
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
export type TDynaduxReducer<TState, TPayload> = (params: IDynaduxReducerAPI<TState, TPayload>) => Partial<TState>;

export interface IDynaduxReducerAPI<TState, TPayload> {
  action: string;
  payload: any;
  dispatch: TDynaduxDispatch<TPayload>;
  state: TState;
}
```

### Examples

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
export interface IDynaduxMiddlewareBeforeAPI<TState, TPayload> {
  action: string;
  payload: any;
  dispatch: TDynaduxDispatch<TPayload>;
  state: TState;
}

export interface IDynaduxMiddlewareAfterAPI<TState, TPayload> {
  action: string;
  payload: any;
  dispatch: TDynaduxDispatch<TPayload>;
  state: TState;
  initialState: TState;
}

export type TDynaduxDispatch<TPayload = any> = <TPayload>(action: string, payload: TPayload) => void;

export interface IDynaduxMiddleware<TState = void, TPayload = void> {
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

_...soonish_


# FAQ

## Why not use Provider and React's context

Dynadux doesn't provide a [Provider](https://reactjs.org/docs/context.html)... at least for now.

Dynadux is made to create small or large scale mutiple and reusable State management. 

A Provider tents to promote one State Management that makes the apps kind of monolithic.

The idea is to pass to the children what they need. So it not good practice to pass either the whole `store` but break down and provide only what is needed.