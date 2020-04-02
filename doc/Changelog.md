[🏠 Home](../README.md)

# Dynadux - Changelog

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

[Sections](./Sections.md) simplifies the creation of root properties of apps or big components. 

### v1.7.0 

##### IDispatchConfig: Stores's dispatch() method 3rd argument

Reducer's dispatch method accepts as 3rd argument a configuration object of `IDispatchConfig` interface.

Currently, this interface has only the `triggerChange: boolean` with default value `true`.

Setting the `triggerChange` to `false` a `dispatch` can ask from Dynadux to do not trigger the `change`.

##### Reducer's API offer the blockChange() method

Inside reducer's (action's) implementation, Dynadux is offering the `blockChange()` method. In this way, reduce itself can block the `onChange` call.

# Read more 

- [FAQ](./FAQ.md) Frequently asked questions
- [React](./React.md) How to use it in react
- [Examples](./Examples.md) Live examples. Examples compared to redux's implementations
- [Terminology](./Terminology.md) Terminology of dynadux, (is small!).
- [History, Undo/Redo middleware](https://github.com/aneldev/dynadux-history-middleware) Middleware for History, Undo/Redo and Restore Points.
- [🏠 Home, Contents](../README.md#table-of-contents)
