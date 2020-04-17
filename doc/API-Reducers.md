[🏠 Home](../README.md)

# Dynadux - Reducers

## What is a reducer

Reducer is a function that is called by the Dynadux's store when an Action is dispatched.

This function is assigned for action in the `createStore` configuration.

The function is called with and object (here, we call it API) that has a few properties, including the current state of the store. This API is explained later in this text. 

The reducer would return 
- the partial state of the store
- the whole state of the store 
- nothing if it is not going to change the store

A reducer might call other reducers to update parts of the state. 

Reducers would change the state when they are called to.

Reducers cannot be added at a later time. This always makes our store pure and predictable from the very starting point. You can define unlimited reducers/actions.

An action is not really dispatched to all reducers and this helps to avoid making monolithic reducers. 

If you want to share data, you should share it through the state and not through dispatched actions.

## Example

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
The `reducers` property is an object.
One of the keys to this object is the `ADD_TODO`.
The value of this key is an arrow function.

This function is called with an argument, an object where it is the API of the Dynadux's reducer.  


## API of the reducer

**Typescript declaration**
```
type TDynaduxReducer<TState, TPayload> = (params: IDynaduxReducerAPI<TState, TPayload>) => undefined | void | Partial<TState>;

interface IDynaduxReducerAPI<TState, TPayload> {
  action: string;
  payload: any;
  state: TState;
  dispatch: TDynaduxDispatch<TPayload>;
  blockChange: () => void;
}
```

**In a simpler way**

An object of the `IDynaduxReducerAPI` interface is given to the reducer callback.

So the object has
- `action`, is the string, is the name of the Action, for instance `ADD_TODO`.
- `payload`, is the payload of the action, it is the 2nd argument of the called `dispatch`
- `state`, is the state of the store 
- `dispatch`, is the function to dispatch other actions from inside of the reducer
- `blockChange`, is a function in order to block the `onChange` callback call _explained later in this page_.

# Dispatch from a reducer

Your reducer is called with an API object as an argument. _The reference of the API is a few lines below._

Example: Fetch something from the network and update the state

```
reducers: {
  [actions.GET_INFO_REQUEST]: ({dispatch}) => {
  
    fetch('http://www.example.com/api/beer-pubs-near-me')
      .then(info => dispatch(actions.GET_INFO_RESPONSE, info))
      .catch(error => dispatch(actions.GET_INFO_ERROR, error));
  },
},
```

When the fetch is fulfilled, it will dispatch the GET_INFO_RESPONSE or the GET_INFO_ERROR action.

# Split the work of the reducer

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
```

We would create a reducer to remove the todo

```
const reducerRemoveTodo = (todos, removeTodoId) => {
  return todos.filter(todo => todo.id !== removeTodoId)
}
```
The reducers now, would be like this
```
reducers: {
  [actions.ADD_TODO]: ({state: {todos}, payload}) => {
    return {
      todos: todos.concat(payload),
    };
  },
  [actions.REMOVE_TODO]: ({state: {todos}, payload: todoId}) => {
    return {
      todos: reducerRemoveTodo(todos, todoId),
    };
  },
},
```

Splitting the reducers helps you to create easy, bigger and more complex states that can be tested since they are pure functions.

Splitting the reducers is not a part of the Dynadux. Dynadux calls the action’s reducer and you are free to call any sub reducer you may need.

### Multiple reducers for an action

An action can have multiple reducers. This is useful in large applications. 

The `reducers` property of the configuration of the Dynadux, accepts a `IDynaduxReducerDic<TState>` or an array of `IDynaduxReducerDic<TState>`.

The `IDynaduxReducerDic<TState>` is a dictionary object action/reducer function.

On `reducer` you can assign and array of dictionaries with same keys.

A common example is, two dictionaries of actions (or more) have the "logout" action.

# Block change

Dynadux provides the `blockChange` function in the reducer's function.

In the reducer's (action's) implementation, you can call this method to say to Dynadux to do not call the `onChange` callback.

Dynadux, by default, is always calling the `onChange` callback on each `dispatch`. 
But in some cases, it is unnecessary to call the `onChange` when nothing is changed.

Once the action (the implementation of the reducer), knows that nothing has been changed for the UI logic, it can block the `onChange` call calling the `blockChange()` method.

**Note: `blockChange()` is also blocking the changes made by middlewares!** 
On each `dispatch`, Dynadux is calling the loaded middlewares, before, and after reducer's function.
When the `blockChange()` is called, the potential changes of the state by middlewares will be not triggered.
But of course, will be not lost, on the next `onChange` call these changes will be there.

### Example of `blockChange()`

```
const store = createStore<ITodoAppState>({
  onChange,
  onDispatch: (action, payload) => dispatchedActions.push({action, payload}),
  initialState: {
    logged: false,
    todos: [],
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

In this example, the `ADD_TODO` action offers the `doNotChange: boolean` in its payload interface.

Now, this action can be called sometimes without trigger the `onChange` of the store. 

For instance, on fetch of todos, we can call this action for each on todo with `doNotChange: true`, and on the last one, only omit the `doNotChange` prop to flush the changes.   

# Understanding Sequential Dispatches

// Todo

# Continue

[⬅️ Create Store](doc/API-CreateStore.md) 🔶 [Middlewares ➡️](doc/API-Middlewares.md) 

[🏠 Home, Contents](../README.md#table-of-contents)
