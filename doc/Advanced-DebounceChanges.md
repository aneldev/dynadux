[🏠 Home](../README.md)
[🏠 Advanced](./Advanced.md)

# Advanced - Debounce the changes

In React components, when you have intensive state changes, they are transformed into renders.

The React's `shouldComponentUpdate` is a solution, but it is not the silver bullet.

Since the Dynadux offers the `onChange` callback, you can control the rate of the renders.

Imagine this app store:

```
const createTodoAppStore = (onChange: (state: ITodoAppState) => void) => {
  const store = createStore<ITodoAppState>({
    initialState: {
      todos: [],
    },
    onChange,
    reducers: {
      [actions.ADD_TODO]: ({state: {todos}, payload}) => {
        return {
          todos: todos.concat(payload),
        };
      },
      [actions.REMOVE_TODO]: ({state: {todos}, payload: todoId}) => {
        return {
          todos: todos.filter(todo => todo.id !== todoId),
        };
      },
    },
  });

  return {
    get state() { return store.state; },
    addTodo: (todo: ITodo) => store.dispatch<ITodo>(actions.ADD_TODO, todo),
    removeTodo: (todoId: string) => store.dispatch<string>(actions.REMOVE_TODO, todoId),
  };
};

```

On the constructor of the component, create the store like this:

```
constructor(props) {
  super(props);
  this.store = createTodoAppStore(
    _.debounce(
      this.setState.bind(this),
      20,
      {leading: true, maxWait: 20},
    )
  );
}
```

With this, the render will be done every 20ms.

In this example, we use loadash's debounce, but you can use any debounce tool you want.

> The debounce technique also supported by the [react-dynadux's Provider](https://github.com/aneldev/react-dynadux). 

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
