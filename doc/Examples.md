# Examples

## Counter

### [Redux version](https://codesandbox.io/s/github/reduxjs/redux/tree/master/examples/counter)

This is a Redux version.
 
### [Dynadux version](https://codesandbox.io/s/festive-wright-jur7b)

With dynadux, we don't need the react-redux (and redux of course).

This example demonstrates how you can adapt to it. But this is not the approach of dynadux.

The changes are
- reducers are much simpler, decoupled from "dispatch" logic 
- index.js is using now the dynadux store

### [Dynadux final version](https://codesandbox.io/s/amazing-bohr-xzhp0)

In this version, we move the creation of the store under `stores/createCounterStore.js`.

The `createCounterStore` requires
- the initial state
- onChange callback to propagate the changes
and returns
- business logic methods

So everything that has to do with the state is in this file (or under this folder).

The components don't need dispatch anymore. In this way, you can pass more business-oriented methods instead of dispatches of that luck of types also.

## Todos

### [Redux version](https://codesandbox.io/s/github/reduxjs/redux/tree/master/examples/todos)

This is a Redux version.

### [Dynadux version](https://codesandbox.io/s/sleepy-browser-mijt6)

With Dynadux
- The store is created in stores/createAppStore.js
- The store provides the state and business logic oriented methods
- In containers you don't need to dispatch anymore, simply use the business methods safely.
- It uses the existed reducers but simplified to plain functions
- The actions folder is not needed anymore
- The actions are bound with the reduces in stores/createAppStore.js in a cheap way
- The containers are much cleaner, are react components that make a mapping
- In containers, we can use now the business methods at any time (with redux you can't).
- The components remain intact since as simply viewers
