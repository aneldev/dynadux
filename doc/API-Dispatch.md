[🏠 Home](../README.md)

# Dynadux - `dispatch()`

Dispatches an action, technically it calls reducer with an optional payload.

The `dispatch` method is available in

- store’s instance
- reducers _and_
- middlewares

# `dispatch()` method signature

In Plain form:
```
dispatch(action, payload, dispatchConfig? )
```
In Typescript form:
```
type TDynaduxDispatch<TPayload = any> = <TPayload>(action: string, payload?: TPayload) => void;
```

The dispatcher is a simple method with 2 arguments.

- 1st (required), the action, where is a string
- 2nd (optional) is the payload, could be anything, a string, a number, an object, null.
- 3rd (optional) a dispatch configuration

For example:

```
store.dispatch(‘login-user’, {loginName: ‘info@example.com’, psw:’123@456’})
store.dispatch(action.USER_LOGIN, userInfo);
store.dispatch(action.USER_LOGOFF);
```

# `dispatch`'s configuration object (3rd parameter)

This small config object that currently has only one attribute.

##### `blockChange: boolean` by default is false

Dynadux by default calls the `onChange` when the reducer, or a middleware returns a _partial_ state.

When you want a dispatch to do not call the `onChange` of the store, set the `blockChange` to `true`. 

For example:
 
```
store.dispatch(action.UPDATE_METADATA, {meta}, {blockChange: true});    // Block the onChange callback call
store.dispatch(action.UPDATE_CONFIG, config);                           // This is will trigger the change as normal
store.dispatch(action.SOMETHING_ELSE);
```

Note:
- middlewares still are called
- `onDispatch` callback still is called

# Continue

[⬅️ Main page](./API-CreateStore.md) 🔶 [Reducers ➡️](./API-Reducers.md) 

[🏠 Home, Contents](../README.md#table-of-contents)

