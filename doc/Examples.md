# Examples

If you are already a Redux developer, you can compare the Redux versions with Dynadux versions.

Most of the examples are forked Redux examples and replaced with Dynadux.

## Counter

### [Redux version](https://codesandbox.io/s/github/reduxjs/redux/tree/master/examples/counter)

This is the Redux version.
 
### [Replace Redux with Dynadux](https://codesandbox.io/s/festive-wright-jur7b)

With Dynadux, we don't need the react-redux (and redux of course).

This example demonstrates how you can adapt to it, **but, this is not the approach of Dynadux**.

**Changes:**
- reducers are much simpler, decoupled from "dispatch" logic 
- index.js is using now the Dynadux store

### [Dynadux approach](https://codesandbox.io/s/amazing-bohr-xzhp0)

This is how the dynadux would be used.

**Changes:
- the create of the store is under the `stores/createCounterStore.js`
- the creation of the store is done on constructor
- there also we bount the `setState`
- we use the `store.state` as state
- the `createCounterStore` exposes business logic methods to update the state

## Todos

### [Redux version](https://codesandbox.io/s/github/reduxjs/redux/tree/master/examples/todos)

This is the Redux version.

### [Dynadux version](https://codesandbox.io/s/sleepy-browser-mijt6)

With Dynadux
- The store is created in stores/createAppStore.js
- The store provides the state and business logic methods
- In containers you don't need to dispatch anymore, simply use the business methods safely.
- It uses the existed reducers but simplified to plain functions
- The actions folder is not needed anymore
- The actions are bound with the reduces in stores/createAppStore.js in a cheap way
- The containers are much cleaner, are react components that make a mapping
- In containers, we can use now the business methods at any time (with redux you can't).
- The components remain intact since they are simply viewers
