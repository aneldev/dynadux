# Examples

## Counter

### [Redux version](https://codesandbox.io/s/github/reduxjs/redux/tree/master/examples/counter)

This is a Redux version.
 
### [Dynadux version](https://codesandbox.io/s/festive-wright-jur7b)

With dynadux we don't need the react-redux (and redux of course).

This example demonstrates how you can adapt it. But this is not the approach of dynadux.

The changes are
- reducers are much simpler, decoupled from "dispatch" logic 
- index.js is using now the dynadux store

### [Dynadux final version](https://codesandbox.io/s/amazing-bohr-xzhp0)

In this version we move the creation of the store under to `stores/createCounterStore.js`.

The `createCounterStore` requires
- the initial state
- onChange callback to propagate the changes
and returns
- business logic methods

So everything that has to do with the state is in this file (or under this folder).

The components doesn't need dispatch anymore. In this way, you can pass more business oriented methods instead dispatches that luck of types also.
