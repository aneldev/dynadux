[🏠 Home](../README.md)

[🏠 Advanced](./Advanced.md)

# Advanced - Understanding Dispatches in Reducer

When you dispatch something, Dynadux is always putting the dispatch is a queue. The dispatch will be called after all previous dispatches are completed.

The dispatches are always synchronous.

In a reducer, it is common to make multiple dispatches. 

In case this reducer also returns a partial state, keep in mind the returned partial state will be applied before the dispatched actions, although it is on the bottom of the reducer function.

For example:

```
const store = createStore<ITodoAppState>({
  onChange,
  onDispatch: (action, payload) => dispatchedActions.push({action, payload}),
  initialState: {
    logged: false,
    todos: [],
    showTodos: false,
  },
  reducers: {
    [actions.SHOW_TODOS]: () => ({showTodos: true}),
    [actions.LOGIN]: ({payload: logged}) => {
      dispatch(actions.SHOW_TODOS);
      // At this point the store.state.showTodos is still false!
      dispatch(actions.VALIDATE_TODOS);
      return {logged};
    },
  },
});
```
The return `{logged}` will be applied on the state before the `dispatch(actions.SHOW_TODOS)`.

This is expected because we `dispatch(actions.SHOW_TODOS)` at a point where the `actions.LOGIN` is already dispatched and is returning the `{logged}`.

Also, inside the reducer, when we `dispatch(actions.VALIDATE_TODOS)`, the `dispatch(actions.SHOW_TODOS)` is not yet executed! 
So the state is not yet updated by the `actions.SHOW_TODOS`.

Dynadux is always synchronizing the dispatch calls. Inside Reducer, an action executed, so `dispatch` calls are synchronized and will be called afterward.

This is not happening when you dispatch from store's instance. 

For example, using the above store we could do:
 
```
store.dispatch(actions.SHOW_TODOS);
// At this point the store.state.showTodos is true!
store.dispatch(actions.VALIDATE_TODOS);
```

Technically, Dynadux doesn't do anything different. The `dispatch` function is everywhere the same.

But here the state is updated, and the `store.state.showTodos` is `true` because the execution of the action is completed and not in the middle as in reducer's case.

# Sum up

- `dispatch` function is everywhere the same (store, reducer middleware)
- `dispatch` is always synchronous
- Calling the `dispatch` inside reducer is synchronous and will be executed afterward
- Calling the `dispatch` from the store's instance is synchronous again, but, the state is updated because the execution of the action is completed
 
[🏠 Advanced](./Advanced.md)

# Read more 

- [FAQ](./FAQ.md) Frequently asked questions
- [React](./React.md) How to use it in react
- [Examples](./Examples.md) Live examples. Examples compared to redux's implementations
- [Typescript](./doc/Typescript.md) Tips for Typescript implementations
- [Terminology](./Terminology.md) Terminology of dynadux, (is small!)
- [History, Undo/Redo](https://github.com/aneldev/dynadux-history-middleware) Middleware for History, Undo/Redo and Restore Points
- [React Dynadux](https://github.com/aneldev/react-dynadux) Provider for Dynadux App Stores
- [Changelog](./Changelog.md) Changes of Dynadux per semver version
- [🏠 Home, Contents](../README.md#table-of-contents)
