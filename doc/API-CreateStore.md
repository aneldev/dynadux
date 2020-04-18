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
    onChange: (state, action, payload) => console.log('State changed:', state, 'by action:', action, 'payload:', payload),
});

```

# The `createStore` configuration

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
For more, we will discuss the [reducers here](doc/API-Reducers.md) later.

The `reducers` property is an object that the key is the Action (string), and the value of the key is the Reducer function.

The `reducers` property would also be an array of objects.

#### property `middlewares`

This property is optional, is an array of [Middlewares](doc/API-Middlewares.md) discussed later.

#### property `onChange: (state: TState, action: string, payload: any) => void`

Optional callback that is called when a middleware or the reducer returns partial state.

When on dispatch, no middleware or reducer returns anything then this callback will not be called. 

#### property `onDispatch: (action: string, payload: any) => void`

This optional callback called after the actions dispatched regardless is the state is changed.

This callback is useful to get when an action is dispatched and use it as an event.

For instance, you can dispatch action not indented for a reducer or a middleware but the user of the store. Since no middleware or reducer react to this action, the `onChange` won't be called but only the `onDispatch`.

# The `createStore` return

The return of the `createStore` are two properties only
- `state` a getter to get the current state
- `dispatch(action, payload)` method to dispatch actions

**This simple API makes the Dynadux simple to fit it anywhere.**

_Yes, you can create sub stores!_

## `state` getter

A getter to get the current state.

## `dispatch` method

Dispatches an action, technically it calls a reducer with an optional payload. 

The `dispatch` method explained on next chapter.

# Continue

[⬅️ Main page](../README.md) 🔶 [Dispatch ➡️](./API-Dispatch.md) 

[🏠 Home, Contents](../README.md#table-of-contents)

