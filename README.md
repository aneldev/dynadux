# What is Dynadux

Advanced and simpler Stores based on `dispatch` and Reducers.

Dynadux is an alternative to Redux. 

It doesn't use Redux and it reduces Redux's cumbersome.

It can work for NodeJs libraries, React Apps or React Components without complementary libraries.

[See the live examples](./doc/Examples.md).

# How does it work?

In general 
- You dispatch actions
- Dynadux is calling the reducers and middlewares
- Dynadux is calling the onChange callback with the new state

# Motivation

## Benefits to work with Dynadux instead of classic setState

- Reusable State Management.
- The use of pure reducer functions.
- Centralizing the state makes.
- Debuggable.
- History of the changes.

## Benefits against Redux

If you are familiar with Redux these are the benefits you gain with Dynadux.

- Dynadux creates stores with an extremely less effort. 
- No complementary libs are required.
- Containers are Components in dynadux, this enriches the lifecycle of the containers. 
- You can dispatch from containers at any time (not only on Redux's mapping times).
- Containers would be omitted!
- Dynadux's approach simplifies the use of the `store` and containers they are not needed!
- Create easily multiple stores, every component would have its own store.
- You can wrap a Store easily to a React Hook.
- Small stores mean that smaller parts of the app are rendered on a change.
- It is faster because it uses the related reducer and not all of them.
- It encourages you to create business logic methods and not dispatch from containers.
- Better API for reducers and middlewares.
- No need for Thunk! `dispatch` is provided for all the reducers and middlewares.
- Middlewares have callbacks before and after the dispatch of the action.
- Dynadux implementation is super simple, it is only an `Object.assign()`.
- No need to read tons of documentation, just this text is enough to learn it.
- Easier tests, just mock network requests of the actions, not the store itself.
- Written in Typescript, supports types.

# Import
```
import {createStore} from "dynadux";
```

# Example to create a store
This is the store to add and remove todo items.

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

> Note: this is a suggestion, not a mandatory.

It is nice to have a store and dispatch actions, but we can do something more.

## The principals

- wrap the create Dynadax store
- return a getter for the state
- return business logic methods that dispatch actions
- do not expose the dispatch _but expose methods that dispatch actions_
- do not expose the store _to ensure that the store is handled properly_

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

Now our `store` it won't be directly a `dynadux` store but a more sophisticated business one.

```
const store = createTodoAppStore(state => console.log('State change:', state));

```

And we can add a todo in a more business logic way.

```
store.addTodo({id: '121', label: 'Drink beers'});
```

For React components the store should be instantiated in constructor.
```
const store = createTodoAppStore(this.setState.bind(this));

```
Then pass the `store` to the children components and use the `store.state` as state.

It is not needed to pass the entire store to the children, pass only what is needed.

# How to use it in React apps/components

1. Create a `createAppStore` method like the `createTodoAppStore` above.
2. On the constructor of the app component call this `this.store = createAppStore(this.setState.bind(this))`.
3. In the components use the `this.store.state` as a state
4. Use the exposed methods of the `this.store` to change the state

Check out the [A Todo app (React app)](https://codesandbox.io/s/sleepy-browser-mijt6) example.

# Examples

**Small and live examples.**

Briefly here is a couple.

- [The counter (React app)](https://codesandbox.io/s/amazing-bohr-xzhp0)

- [A Todo app (React app)](https://codesandbox.io/s/sleepy-browser-mijt6)

[All examples](./doc/Examples.md), can be compared with the examples of redux .  
# API of Dynadux

## createStore method

This method creates a store. A store is a State.

As parameter it requires a config object of the `IDynaduxConfig` interface.

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
What is required are the reducers only. They are called on Action's dispatches.

The return of the `createStore` are two properties only
- `state` a getter to get the current state
- `dispatch(action, payload)` method to dispatch actions

This simple API makes the Dynadux simple to fit it anywhere.

## `state` method

A getter to get the current state.

## `dispatch` method

### About

Dispatches an action, technically it calls a reducer with an optional payload.

The `dispatch` method is available in

- store’s instance
- reducers _and_
- middlewares

### `dispatch` method signature

In Plain form:
```
dispatch(action, payload)
```
In Typescript form:
```
type TDynaduxDispatch<TPayload = any> = <TPayload>(action: string, payload?: TPayload) => void;
```

The dispatcher is a simple method with 2 arguments.

- 1st (required), the action, where is a string
- 2nd (optional) is the payload, could be anything, a string, a number, an object, null. 

### Example

```
store.dispatch(‘login-user’, {loginName: ‘info@example.com’, psw:’123@456’})
store.dispatch(action.USER_LOGIN, userInfo);
store.dispatch(action.USER_LOGOFF);
```

## Reducer

### About

When an action is triggered, a reducer is called.

The reducer should return the new state of the store.

A reducer might call other reducers to update parts of the state. 

Reducers change the state when they are called.

Reducers cannot be added at a later time. This makes our store always pure and predictable from the starting point. You can define unlimited reducers/actions.

An action is not really dispatched to all reducers and this helps to avoid making monolithic reducers. 

If you want to share data, you should share it through the state and not through dispatched actions.

### Dispatch from a reducer

Your reducer is called with an API object as an argument. _The reference of the API is few lines below._

Example: Fetch something from the network and update the state


```
reducers: {
      [actions.GET_INFO_REQUEST]: ({state, dispatch}) => {
      
        fetch('http://www.example.com/api/beer-pubs-near-me')
            .then(info => dispatch(actions.GET_INFO_RESPONSE, info))
            .catch(error => dispatch(actions.GET_INFO_ERROR, error));
            
        return state;   // return always the state
      },
},
```

The call of the reducer is always synchronous, it should always return the state.
This is what we did in the example.

When the fetch is fulfilled, it will dispatch the GET_INFO_RESPONSE or the GET_INFO_ERROR action.

### Split the work of reducer

Reducers should return the state of the store. Reducers can call other reducers that will return a part of the state.

For instance, imagine that we have this store

```
{
    todos: []
}
```
And we have these reducers

```
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
```

We would create a reducer to remove the todo

```
const reducerRemoveTodo = (todos, removeTodoId) => {
  return todos.filter(todo => todo.id !== removeTodoId)
}
```
The reducers now would be like this
```
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
      todos: reducerRemoveTodo(state.todos, todoId),
    };
  },
},
```

Splitting the reducers helps you to create easy, bigger and more complex states that can be tested since they are pure functions.

Splitting the reducers is not a part of the dynadux. Dynadux  calls  the action’s reducer and you are free to call any sub reducer you may need.

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

Add a todo
```
reducers: {
    [actions.ADD_TODO]: ({state, payload, dispatch}) => {
        // here we have the entire state, the payload of the dispatch, and…
        // the dispatch method to dispatch other actions
        return {
            ...state,
            todos: state.todos.concat(payload),
        };
    },
    // … other reducers
},
```


## Middlewares

### About

With middlewares, you can
- prepare, maintain, decorate, clean up the state before or after action's dispatch
- create 3rd party middleware libraries, like, load the weather for a city etc
- debugging, monitor the state
- dispatch other 'parallel' actions
- send usage stats

Middlewares can
- access the entire state
- access all dispatched actions from anywhere
- dispatch actions
- have their own actions and behave a 3rd party libraries

### Write your own middleware as 3rd party

Middlewares in Dynadux can `dispatch` anything out of the box, without additional Thunk middlewares as Redux needs. 

You can write your own middlewares that it is only a function that returns an `IDynaduxMiddleware` object _see next_.

The user of the middleware will have to load only the middleware function in Dynadux's `middlewares` array prop only, without need to register reducers _like in Redux_!

### Are always Synchronous

Middlewares are executed synchronously and not asynchronously like Redux.
This is done intentionally to avoid complex and wrong implementations.

If you wanna, for instance, fetch User's info, by a Middleware
- make your async call
- dispatch the result or the error
- synchronously return the state intact

### Implementing a middleware

The middleware can be loaded before the dispatch of the action and/or after the dispatch of the action.

In the `before` phase, you can prepare the state, or enrich the payload.

In the `after` phase, _the most useful one_, you can react to the dispatched action.

The implementation of each phase should always return _synchronously_ the state.

In both phases, you can access the 
- action (string)
- payload
- state (the entire state)
- dispatch method

This API is the same as the reducers. So, middlewares acts  like reducers. The benefit of the reducers is that we can share the state handling among other stores. 

> Redux doesn’t have the `before` phase.

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

#### Logger

This middleware consoles the action that has been dispatched.
```
middlewares: [
    {
        after: ({action, payload, state}) => {
            console.log('dispatch', new Date, action, payload);
            return state; // mandatory to return it
        },
    }
],

```

#### Send stats

```
middlewares: [
    {
        after: ({action, payload, state}) => {
            If (action === ‘USER-LOGIN-ERROR) {
                // post here there error, async
            }
            return state; // mandatory to return it
        },
    }
],

```
#### collect dispatched actions for debugging

Dynadux is shipped with a small middleware for debugging, that it is implemented [here](https://github.com/aneldev/dynadux/blob/master/src/middlewares/dynaduxDebugMiddleware.ts).

The usage of it is described later.

#### dynadux History Middleware

Middlewares can have their own actions.

A live example is the [dynadux-history-middleware](https://github.com/aneldev/dynadux-history-middleware). The whole implementation is in [this file](https://github.com/aneldev/dynadux-history-middleware/blob/master/src/dynaduxHistoryMiddleware.ts).

Here, it is easy to make a History State management, navigating back and forth in time and offering **restore points**.

# Debugging

## dynaduxDebugMiddleware

Dynandax comes with middleware for debugging that collects the dispatched actions in a global array.

### Usag

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

`dynaduxDebugMiddleware` adds to the global array variable `dynaduxDebugMiddleware` all the dispatched items.

This middleware, as many other debugging tools, should not be on production since it would lead to a memory leak.

### API of dynaduxDebugMiddleware

As a parameter it accepts a configuration object with this interface.

```
interface IDynaduxDebugMiddlewareConfig {
  globalVariableName?: string;
}
```
#### globalVariableName

When you work with a multiple store it makes sense to save debugging info of the `dynaduxDebugMiddleware` in different global variables.

To load the middleware and save the array in different global name, for instance `debugState`, we can create the middleware like this:

`dynaduxDebugMiddleware({ globalVariableName: 'debugState '})`

# Dynadux's Architecture

**Dynadux is a very simple library.** Technically the Dynadux is only an 

`Object.assign({}, state, middleware.before(), reducer(), middleware.before(),)`

and nothing else!

What makes it powerful and easy to use is the architecture described in this text.

# You can also read 

- [FAQ](./doc/FAQ.md)
- [Examples](./doc/Examples.md)  
- [History, Undo/Redo middleware](https://github.com/aneldev/dynadux-history-middleware)  

