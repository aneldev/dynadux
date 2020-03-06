# Examples

If you are already a Redux developer, you can compare the Redux versions with Dynadux versions.

Most of the examples are forked Redux examples and they are replaced with Dynadux.

## Counter

### [Redux version](https://codesandbox.io/s/github/reduxjs/redux/tree/master/examples/counter)

This is the Redux version.
 
### [Replace Redux with Dynadux](https://codesandbox.io/s/festive-wright-jur7b)

With Dynadux, we don't need the react-redux (and redux of course).

This example demonstrates how you can replace Redux, **but, this is not the approach of Dynadux**.

**Changes:**
- reducers are much simpler, decoupled from "dispatch" logic 
- index.js is using now the Dynadux store

### [Dynadux approach](https://codesandbox.io/s/amazing-bohr-xzhp0)

This is how the dynadux can be used.

**Changes:**
- the creation of the dynadux store is under the `stores/createCounterStore.js`
- the creation of the app store is done on constructor
- also, on constructor, we bind the `setState` method
- we use the `store.state` as a state
- the `createCounterStore` exposes business logic methods to update the state

## Todos

### [Redux version](https://codesandbox.io/s/github/reduxjs/redux/tree/master/examples/todos)

This is the Redux version.

### [Dynadux version](https://codesandbox.io/s/sleepy-browser-mijt6)

With Dynadux
- The store is created in stores/createAppStore.js
- The store provides the state and business logic methods
- In containers you don't need to dispatch anymore, simply use the business methods safely.
- It uses the existed reducers which is simplified
- The actions folder is not needed anymore
- The actions are bound with the reducers in stores/createAppStore.js in a cheap way
- The containers are much cleaner, are react components that make a mapping
- In containers, we can use the now business methods at any time (with redux you can't).
- The components remain intact since they are simply viewers
- The containers would be omitted!

## Shopping Cart example

### [Cart example with multiple reducers](https://codesandbox.io/s/dynadux-shopping-cart-example-icygs)

The create store is different here, as `reducers` we pass the any array of two dictionaries of action/reducer pairs.

In this way, the `ADD_TO_CART` action exists in both Sections, Products and .
