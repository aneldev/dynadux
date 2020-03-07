![Image description](doc/assets/dynadux-logo.png)

##### Table of Contents  
[What is Dynadux](#whatIs)  
[How does it work?](#howItWorks)  
[Motivation](#motivation)  
[Create a Store](#createAStore)  
[Create a Business Store](#createABusinessStore)  
[Architecture](#architexture)  
[API](#api)  
[Use it in React](./doc/React.md)
[Read more](#readMore)  

<a name="whatIs"/>
# What is Dynadux

Advanced and simpler Stores based on `dispatch` and Reducers.

Dynadux is an alternative to Redux. 

It doesn't use Redux and it reduces Redux's cumbersome.

It can work for NodeJs libraries, React/Vue Apps or React Components without complementary libraries.

[See the live examples](./doc/Examples.md).

<a name="howItWorks"/>
# How does it work?

In general 
- You dispatch actions
- Dynadux is calling the reducers and middlewares
- Dynadux is calling the onChange callback with the new state

<a name="motivation"/>
# Motivation

## Benefits to work with Dynadux instead of classic setState

- Reusable State Management.
- The use of pure reducer functions.
- Centralizing the state makes.
- Debuggable.
- History of the changes.

## Benefits instead of Redux

If you are familiar with Redux these are the benefits you gain with Dynadux.

- Dynadux creates stores with an extremely less effort. 
- No complementary libs are required.
- Containers are Components in dynadux, this enriches the lifecycle of the containers. 
- You can dispatch from containers at any time (not only on Redux's mapping times).
- Containers would be omitted!
- Dynadux's approach simplifies the use of the `store` and containers they are not needed!
- Create easily multiple stores, every component would have its own store.
- You can wrap a Store easily to a React Hook.
- Small stores mean that smaller parts of the app are rendered on a change.
- It is faster than Redux because it uses the related reducer and not all of them.
- It is faster than Mobx because it doesn't scan your state.
- It encourages you to create business logic methods and not dispatch from containers.
- Better API for reducers and middlewares.
- No need for Thunk! `dispatch` is provided for all the reducers and middlewares.
- Middlewares have callbacks before and after the dispatch of the action.
- Dynadux implementation is super simple, it is only an `Object.assign()`.
- No need to read tons of documentation, just this text is enough to learn it.
- Easier tests, just mock network requests of the actions, not the store itself.
- Written in Typescript, supports types.

# Install
```
npm install dynadux
```
or
```
yarn add dynadux
```
Types are already there. _Dynadux is written in TypeScript._

# Import
```
import {createStore} from "dynadux";
```
Everything of Dynadux is imported with `{} from "dynadux`, _no default exports_.

<a name="createAStore"/>
# Create a Store
This is the store to add and remove todo items.

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
Now lets add a todo
```
store.dispatch(actions.ADD_TODO, {id: '234', label: 'Drink beers'}});
```
Let's remove this todo
```
store.dispatch(actions.REMOVE_TODO, '234');
```
On every change the `onChange` will be called with the above code will be consoled.

<a name="createABusinessStore"/>
# Create a Business Store (Dynadux's approach)

Create business logic stores and methods.

> Note: this is a suggestion, not a mandatory.

It is nice to have a store and dispatch actions, but we can do something more.

## What is Business Store

Business store is a function that
- creates a Dynadux store that is used internally in this function only
- we pass the Dynadux the initial state and the actions/reducers pairs 
- the function returns an object with methods and getters and this is the API of out Business store

The containers and any other components will use these functions. 

## The principals

- wrap the create Dynadux store
- return a getter for the state
- return business logic methods that dispatch actions
- do not expose the dispatch _but expose methods that dispatch actions_
- do not expose the store _to ensure that the store is handled properly_

```
const createTodoAppStore = (onChange) => {
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
                  todos: todos.filter(todo => todo.id !== todoId),
                };
              },
        },
        onChange,
    });

    return {
        get state() { return store.state; },
        addTodo: (todo) => store.dispatch(actions.ADD_TODO, todo),
        removeTodo: (todoId) => store.dispatch(actions.REMOVE_TODO, todoId),
    };
};

```
This is a function that creates the store and provides business logic methods. The `addTodo` & the `removeTodo`.

## Use the "app" store

Now our `store` it won't be directly a `dynadux` store but a more sophisticated business one.

```
const store = createTodoAppStore(state => console.log('State change:', state));

```

And we can add a todo in a more business logic way.

```
store.addTodo({id: '121', label: 'Drink beers'});
```

For React components the store should be instantiated in constructor.
```
const store = createTodoAppStore(this.setState.bind(this));

```
Then pass the `store` to the children components and use the `store.state` as state.

It is not needed to pass the entire store to the children, pass only what is needed.

## Benefits of Business stores

In the Business store approach, the Containers are not dispatching actions but they use the methods of the store.

The action would be dispatched from any container. But some actions are for the internal use of the reducers. 
Also, each action requires a specific type of payload. But from the action's user perspective it is unclear which payload type should be used.

All these problems are solved providing to the containers javascript methods that do all this job. These are the Business methods provided by the app store that is wrapping the Dynadux store.

In the end, only business methods, reducers, and middlewares are dispatching actions. This makes the code much cleaner and the actions are used safely. 

# That's all

The logic o Dynadux is depicted in the text above. 

There is nothing more. Simple and portable use your imagination and create Business Stores.

<a name="architexture"/>
# Dynadux's Architecture

**Dynadux is a very simple library.** Technically the Dynadux is only an 

`Object.assign({}, state, middleware.before(), reducer(), middleware.after())`

and nothing else!

What also makes it powerful and easy to use is the architecture described in this text.

<a name="api"/>
# API

Learn the api to master the Dynadux.

- [API - Create store](./doc/CreateStore.md)
- [API - Reducers](./doc/Reducers.md)
- [API - Middlewares](./doc/Middlewares.md)
- [Debug Dynadux apps](./doc/Debugging.md) 🎉 and that's it, you are mastering the Dynadux.

<a name="readMore"/>
# Read more 

- [FAQ](./doc/FAQ.md) Frequently asked questions
- [Use it in React](./doc/React.md) How to use it in react
- [Examples](./doc/Examples.md) Live examples. Examples compared to redux's implementations
- [Advanced](./doc/Advanced.md) Dispached promises, boost up your app and more.
- [Terminology](./doc/Terminology.md) Terminology of dynadux, (is small!).
- [History, Undo/Redo middleware](https://github.com/aneldev/dynadux-history-middleware) Middleware for History, Undo/Redo and Restore Points.