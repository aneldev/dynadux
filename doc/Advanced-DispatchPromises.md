[🏠 Home](../README.md)
[🏠 Advanced](./Advanced.md)

# Advanced - Dispatch Promises

```
const actions = {
  ADD_TODO: 'ADD_TODO',             // payload: ITodo
  REMOVE_TODO: 'REMOVE_TODO',       // payload: string (the id of a todo)
  SAVE_TODOS: 'SAVE_TODOS',         // payload: ISaveTodosPayload
};

interface ITodoAppState {
  logged: boolean,
  todos: ITodo[];
}

interface ITodo {
  id: string;
  label: string;
  done: boolean;
}

interface ISaveTodosPayload {
  resolve: () => void;
  reject: (error: any) => void;
}

const createTodoAppStore = () => {
  const store = createStore<ITodoAppState>({
    initialState: {
      logged: false,
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
          todos: todos.filter(todo => todo.id !== todoId),
        };
      },
      [actions.SAVE_TODOS]: ({state: {todos}, payload, dispatch}) => {
        const {resolve, reject}: ISaveTodosPayload = payload;
        saveTodos(todos)  // <-- Your async api method
          .then(resolve)  // call the callback resolve
          .catch(reject); // call the callback reject in case of error
      },
    },
  });

  return {
    get state() { return store.state; },
    
    addTodo: (todo: ITodo) => store.dispatch<ITodo>(actions.ADD_TODO, todo),
    
    removeTodo: (todoId: string) => store.dispatch<string>(actions.REMOVE_TODO, todoId),
    
    saveTodos: (): Promise<void> => {
      return new Promise<void>((resolve, reject) => {
        store.dispatch<ISaveTodosPayload>(
          actions.SAVE_TODOS,
          {resolve, reject},  // this the payload of dispatch, just pass the Promise's callbacks
        );
      });
    },
    
  };
};

```

What is new here: 
- The payload of the SAVE_TODOS actions has two callbacks
- In the reducer we use the network async method `saveTodos`, where is a promise in this case.
- In the reducer, we call the payload's `resolve` or the`reject` callbacks.
- In the return of the `createTodoAppStore`, we expose the method `saveTodos` where returns a promise!
- Inside the `saveTodos` we simply transform the `resolve/reject` callbacks to fulfill the Promise.

[🏠 Advanced](./Advanced.md)

# Read more 

- [FAQ](./FAQ.md) Frequently asked questions
- [React](./React.md) How to use it in react
- [Examples](./Examples.md) Live examples. Examples compared to redux's implementations
- [Typescript](./Typescript.md) Tips for Typescript implementations
- [Terminology](./Terminology.md) Terminology of dynadux, (is small!)
- [History, Undo/Redo](https://github.com/aneldev/dynadux-history-middleware) Middleware for History, Undo/Redo and Restore Points
- [React Dynadux](https://github.com/aneldev/react-dynadux) Provider for Dynadux App Stores
- [Changelog](./Changelog.md) Changes of Dynadux per semver version
- [🏠 Home, Contents](../README.md#table-of-contents)
