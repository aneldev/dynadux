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
  onChange?: (state: TState, action: string, payload?: any) => void;
}
```
What is required are the reducers only. They are called on Action's dispatches.

#### property `initialState`

It is the object of the initial state of the store.

By default is an empty object `{}`

#### property `reducers`

This property is required and expects dictionary object, Action/ReducerFunction pair.

Reducer is a function that is called by the Dynadux, with one argument, an object that has `{state, dispatch, action, payload}` and should return the partial or the whole state of the store or nothing. 
For more, we will discuss the [reducers here](./Reducers.md) later.

The `reducers` property is an object that the key is the Action (string), and the value of the key is the Reducer function.

The `reducers` property would also be an array of objects.

#### property `middlewares`

This property is optional, is an array of [Middlewares](./Middlewares.md) discussed later.

#### property `onChange: (state: TState) => void`

Optional callback, on every dispatch the `onChange` callback is called with one only argument, the State of the Store.

#### property `onDispatch: (action: string, payload: any) => void`

This optional callback called after the actions dispatched and the `onChange`.

This callback is useful to get when an action is dispatched and use it as an event.

For instance, you can dispatch action not indented for a reducer or a middleware but the user of the store.

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
dispatch(action, payload, dispatchConfig? )
```
In Typescript form:
```
type TDynaduxDispatch<TPayload = any> = <TPayload>(action: string, payload?: TPayload) => void;
```

The dispatcher is a simple method with 2 arguments.

- 1st (required), the action, where is a string
- 2nd (optional) is the payload, could be anything, a string, a number, an object, null.
- 3rd (optional) a dispatch configuration

**Examples**

```
store.dispatch(‘login-user’, {loginName: ‘info@example.com’, psw:’123@456’})
store.dispatch(action.USER_LOGIN, userInfo);
store.dispatch(action.USER_LOGOFF);
```

### `dispatch`'s configuration object (3rd parameter)

This small config object that currently has only one attribute.

##### `blockChange: boolean` by default is false

On each `dispatch`, Dynadux is calling the `onChnage` callback, even if the reducer won't return a partial state.

Since v1.6.0 on `dispatch`, you can control if the `onChange` callback will be called or not.

This is useful to reduce the triggered changes of the store.

Ideally, this is for React Components. If you think that this dispatch should not trigger a render, then you can block it with this flag.

Note:
- middlewares still are called
- `onDispatch` callback still is called

**Examples**
 
```
store.dispatch(action.UPDATE_METADATA, {meta}, {blockChange: true});    // Block the onChange callback call
store.dispatch(action.UPDATE_CONFIG, config);                           // This is will trigger the change as normal
store.dispatch(action.SOMETHING_ELSE);
```

# Continue

[⬅️ Main page](../README.md) 🔶 [Reducers ➡️](./Reducers.md) 

[🏠 Home, Contents](../README.md#table-of-contents)

