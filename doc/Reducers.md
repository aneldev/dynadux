[🔙 Back to the main page](../README.md)

# Dynadux - Reducers

## What is a reducer

Reducer is a function that is called by the Dynadux's store when an Action is dispatched.

This function is assigned for action in the `createStore` configuration.

The function is called with and object (we call it API in this text) that has few properties, including the current state of the store. This API is explained later in this text. 

The reducer would return 
- the partial state of the store
- the whole state of the store 
- nothing if is not going to change the store

A reducer might call other reducers to update parts of the state. 

Reducers would change the state when they are called.

Reducers cannot be added at a later time. This makes our store always pure and predictable from the starting point. You can define unlimited reducers/actions.

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

This function is called with one argument, an object where is the API of the Dynadux's reducer.  


## API of the reducer

**Typescript declaration**
```
type TDynaduxReducer<TState, TPayload> = (params: IDynaduxReducerAPI<TState, TPayload>) => undefined | void | Partial<TState>;

interface IDynaduxReducerAPI<TState, TPayload> {
  action: string;
  payload: any;
  dispatch: TDynaduxDispatch<TPayload>;
  state: TState;
}
```

**In a simpler way**

An object of the `IDynaduxReducerAPI` interface is given to the reducer callback.

So the object has
- `action`, is the string, is the name of the Action, for instance `ADD_TODO`.
- `payload`, is the payload of the action is the 2nd argument of the called `dispatch`
- `dispatch`, is the dispatch action to dispatch other actions from inside the reducer
- `state`, is the state of the store 

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

# Split the work of reducer

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
The reducers now would be like this
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

# Continue

[⬅️ Create Store](./CreateStore.md) 🔶 [Middlewares ➡️](./Middlewares.md) 

