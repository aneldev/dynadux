# Advanced

Dynadux is simple, and since its simple is more flexible.

> The examples here are in typescript.

# Dispatch with promise

```
const actions = {
  ADD_TODO: 'ADD_TODO',             // payload: ITodo
  REMOVE_TODO: 'REMOVE_TODO',       // payload: string (the id of a todo)
  SAVE_TODOS: 'SAVE_TODOS',         // payload: ISaveTodosPayload
};

interface ITodoAppState {
  logged: boolean,
  todos: ITodo[];
  saved: boolean;
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
      saved: false,
    },
    reducers: {
      [actions.ADD_TODO]: ({state: {todos}, payload}) => {
        return {
          todos: todos.concat(payload),
          saved: false,
        };
      },
      [actions.REMOVE_TODO]: ({state: {todos}, payload: todoId}) => {
        return {
          todos: todos.filter(todo => todo.id !== todoId),
          saved: false,
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
          {resolve, reject},  // this the payload of dispatch, just pass the Promise's callbaks
        );
      });
    },
    
  };
};

```

What is new here is
- The payload of the SAVE_TODOS actions has two callbacks
- In the reducer we use the network async method `saveTodos`, where is promise in this case.
- In the reducer, we call payload's `resolve` or `reject` callbacks.
- In the return of the `createTodoAppStore`, we expose the method `saveTodos` where returns a promise!
- Inside the `saveTodos` we simply transform the `resolve/reject` callbacks to fulfill the Promise.

# Increase render performance! Debounce the changes.

If you have intensive state changes, this, in React components is transformed into renders.

The `shouldComponentUpdate` is a solution but is not the silver bullet.

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

In this example, we use loadash's debounce but you can use any debouce tool you want.

> In Redux you cannot control the state update since it uses a React Provider.

# Should update

Every `dispatch` means an `onChange` call. For React apps this means `render`s.

State managers like Dynadux help us to create complex and maintainable states with many... dispatches that have a cost on UI apps.

With Dynadux, since we control the `onChange` callback you can control if React will render or not.

You can introduce a new state property `shouldUpdate: boolean` and on `onChange` callback compare this value.  

**Let's do it!**

#### Our Store

```
const createTodoAppStore = (onChange) => {
    const store = createStore({
        initialState: {
            todos: [],
            shouldUpdate: true,
        },
        reducers: {
            // ... many other reducers
            [actions.SHOULD_UPDATE]: ({payload: shouldUpdate}) => ({shouldUpdate}),
        onChange,
    });
    
    return {
        get state() { return store.state; },
        // ... many other methods
    };
};

```

#### In a Reducer or a Middleware

Simply `dispatch(actions.SHOULD_UPDATE, false)` to pause the renders and `dispatch(actions.SHOULD_UPDATE, true)` to resume when you finish with the hard work.

> Do not delay so much or toggle the flag frequently, otherwise, the app might look frozen, especially if there is user's interaction there like input fields. 

> Do not block the thread because this is not accepted in any way!

#### Connection with React component

At component's constructor.

```
constructor(props) {
    super(props);
    this.store = createAppStore((state) => {
        if (state.shouldUpdate) this.setState({});
    });
}
```

_**Tip:** Since you use store's `state`, there is no need to pass them to `setState`._


