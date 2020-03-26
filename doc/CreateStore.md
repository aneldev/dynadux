[🏠 Home](../README.md)

# Dynadux - Create a store

Example

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
          [actions.ADD_TODO]: ({state: {todos}, payload}) => {
            return {
              todos: todos.concat(payload),
            };
          },
          [actions.REMOVE_TODO]: ({state: {todos}, payload: todoId}) => {
            return {
              todos: state.todos.filter(todo => todo.id !== todoId),
            };
          },
    },
    onChange: (state) => console.log('State changed:', state),
});

```

# `createStore` method

This method creates a store. A store is a State.

As a parameter, it requires a config object of the `IDynaduxConfig` interface.

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

#### property `initialState`

It is the object of the initial state of the store.

By default is an empty object `{}`

#### property `reducers`

This is property is required and expects is dictionary object, Action/ReducerFunction pair.

Reducer is a function that is called by the Dynadux, with one argument, an object that has `{state, dispatch, action, payload}` and should return the partial or the whole state of the store or nothing. 
For more, we will discuss the [reducers here](./Reducers.md) later.

The `reducers` property, is an object that the key is the Action (string) and the value of the key is the Reducer function.

The `reducers` property, would be also an array of objects.

#### property `middlewares`

This property is optional, is an array of [Middlewares](./Middlewares.md) discussed later.

#### property `onChange: (state: TState) => void`

Optional callback, on every dispatch the `onChange` callback is called with one only argument, the State of the Store.

#### property `onDispatch: (action: string, payload: any) => void`

This optional callback is called after the actions are dispatched and the `onChange`.

This callback is useful to get when an action is dispatched and use it as an event.

For instance, you can dispatch an action that is not indented for a reducer or a middleware but for the user of the store.

# the return of the `createStore` method

The return of the `createStore` are two properties only
- `state` a getter to get the current state
- `dispatch(action, payload)` method to dispatch actions

**This simple API makes the Dynadux simple to fit it anywhere.**

_Yes, you can have sub stores!_

## `state` getter

A getter to get the current state.

## `dispatch` method

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

### `dispatch` method examples

```
store.dispatch(‘login-user’, {loginName: ‘info@example.com’, psw:’123@456’})
store.dispatch(action.USER_LOGIN, userInfo);
store.dispatch(action.USER_LOGOFF);
```

# Continue

[⬅️ Main page](../README.md) 🔶 [Reducers ➡️](./Reducers.md) 

[🏠 Home, Contents](../README.md#table-of-contents)

