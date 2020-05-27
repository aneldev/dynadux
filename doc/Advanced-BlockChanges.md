[🏠 Home](../README.md)
[🏠 Advanced](./Advanced.md)

# Advanced - Block Changes (block Renders for react components)

Dynadux by default calls the `onChange` when the reducer, or a middleware returns a _partial_ state.

But in some cases there is need to block the change, for instance when we dispatch intensively actions and only at the end makes sense to trigger the `onChange`. 

There are two ways to block a change
- inside the reducer
- on `dispatch()` call 

> For React Components, you can block the changes by dispatched action and payload using the [Dynadux's React Provider](https://github.com/aneldev/react-dynadux).

## Block change from reducer

Inside reducers Dynadux is offering the `blockChange()` function.

For example:

```
const store = createStore<ITodoAppState>({
  onChange,
  onDispatch: (action, payload) => dispatchedActions.push({action, payload}),
  initialState: {
    logged: false,
    todos: [],
    errors: [],
  },
  reducers: {
    [actions.LOGIN]: ({payload: logged}) => {logged},
    [actions.ADD_TODO]: ({state: {todos}, payload, blockChange}) => {
      const {
        todo,
        doNotChange = false,
      }: IADD_TODO_payload = payload;
      if (doNotChange) blockChange();
      return {
        todos: todos.concat(todo),
      };
    },
    [actions.REMOVE_TODO]: ({state: {todos}, payload: todoId}) => {
      return {
        todos: todos.filter(todo => todo.id !== todoId),
      };
    },
  },
});
```

In this example, we can dispatch the `ADD_TODO` action intensively with payload `{todo, blockChange: true}` and on last dispatch without the `blockChange` property.

The `onChange` will be called only once.

## Block change with `dispatch()` function

The 3rd argument of the dispatch is a config object that accepts the `blockChange: boolean` property. 

For example:
 
```
store.dispatch(action.UPDATE_METADATA, {meta}, {blockChange: true});  
store.dispatch(action.LOAD_TODOS, undefined, {blockChange: true});    
```

[🏠 Advanced](./Advanced.md)

# Read more 

- [FAQ](./FAQ.md) Frequently asked questions
- [React](./React.md) How to use it in react
- [Examples](./Examples.md) Live examples. Examples compared to redux's implementations
- [Typescript](./Typescript.md) Tips for Typescript implementations
- [Terminology](./Terminology.md) Terminology of dynadux, (is small!)
- [History, Undo/Redo](https://github.com/aneldev/dynadux-history-middleware) Middleware for History, Undo/Redo and Restore Points
- [React Dynadux](https://github.com/aneldev/react-dynadux) Provider for Dynadux App Stores
- [Change Log](doc/Change-Log.md) Changes of Dynadux per semver version
- [🏠 Home, Contents](../README.md#table-of-contents)
