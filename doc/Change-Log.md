[🏠 Home](../README.md)

# Dynadux - Change Log

Compliant with [SemVer](https://semver.org/) spec.

# v1

### v1.1.0

##### First release

### v1.2.0 

##### Multiple reducers per action

- The `reducers` config property, can be not only a dictionary but an array of dictionaries.

### v1.3.0 

##### debug middleware improvements

- `dispatch` method
- better timestamp
- configurable global variable name

### v1.4.0 

##### `onDispatch` new callback

- Store has now a new `onDispatch` callback to "listen" store's dispatches

##### debug middleware improvements

- new `state` getter for the current state
- new `listPayloads` list that includes the payloads
- new list column with the elapsed time for reducer's execution

### v1.5.0 

##### New Feature Sections

[Sections](./API-Sections.md) simplifies the creation of root properties of apps or big components. 

### v1.7.0 

##### IDispatchConfig: Stores's dispatch() method 3rd argument

Reducer's dispatch method accepts as 3rd argument a configuration object of `IDispatchConfig` interface.

Currently, this interface has only the `triggerChange: boolean` with default value `true`.

Setting the `triggerChange` to `false` a `dispatch` can ask from Dynadux to do not trigger the `change`.

##### Reducer's API offer the blockChange() method

Inside reducer's (action's) implementation, Dynadux is offering the `blockChange()` method. In this way, reduce itself can block the `onChange` call.

## v2

### v2.0.0

###### Debugger's configuration change

With this breaking version, only the Debugger's Configuration is changed.

The `globalVariableName` config property has been renamed to `debuggerStoreName`, and it is required.

Now, the debugger would always be included in the Stores, even in production, since the debugger is activated only when the `debuggerStoreName` is not an empty string.

For more read the [Debugging](./API-Debugging.md) section.

### v2.0.2

The dispatch's config prop `triggerChange` is renamed to `blockChange` _with opposite logic_. 

The `triggerChange` has still backward compatibility with console warn till next major release.

### v2.2.0

###### add/removeChangeEventListener for Store and Sections

You can register/unregister listeners for Store's or Section's changes.

The events approach is a kinda anti-pattern for state managers and for Dynadux as well. So it is not encouraged to use them, so they are not documented _at least at the moment_. Events are not going to be removed and are stable.

Events are used internally to support the `react-dynadux`.

###### Support React Provider [react-dynadux](https://github.com/aneldev/react-dynadux)

`createStore` result also returns the `provider` property, needed by the `react-dynadux`.

### v2.4.0

Catches the errors from middlewares and reducers, since uncaught errors block later dispatches. The error is consoled. 

### v2.4.5

`middlewares` array accepts `false`, `null` and `undefined` values for inline comparison (ternary operators).

# Read more 

- [FAQ](./FAQ.md) Frequently asked questions
- [React](./React.md) How to use it in react
- [Examples](./Examples.md) Live examples. Examples compared to redux's implementations
- [Terminology](./Terminology.md) Terminology of dynadux, (is small!)
- [Typescript](./Typescript.md) Tips for Typescript implementations
- [History, Undo/Redo](https://github.com/aneldev/dynadux-history-middleware) Middleware for History, Undo/Redo and Restore Points
- [React Dynadux](https://github.com/aneldev/react-dynadux) Provider for Dynadux App Stores
- [🏠 Home, Contents](../README.md#table-of-contents)
