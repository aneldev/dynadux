[🏠 Home](../README.md)

# Dynadux Terminology

An instance of the Dynadux has the `state` getter and the `dispatch` method only.

# Store state or IAppState

Is the state that is used by the store. This state is build by the Store's `initialState`s or by the added sections.

The `IAppState` is not exposed to the sections and reducers but not always to the Object user, depends on what is exposed by the output of your business store.

The `IAppState` would be structured like database, and the state would be exported by functions that are using this data resource.

# Business Store or IAppStore

Business Store is an instance that uses Dynadux internally and exposes business methods.

# Reducer

Reducer is a function called by an action's dispatch and returns the new version of the object.

# Read more 

- [FAQ](./FAQ.md) Frequently asked questions
- [React](./React.md) How to use it in react
- [Sections](./API-Sections.md) Create sections for applications or big components
- [Examples](./Examples.md) Live examples. Examples compared to redux's implementations
- [Advanced](./Advanced.md) Dispached promises, boost up your app and more
- [Typescript](./Typescript.md) Tips for Typescript implementations
- [History, Undo/Redo](https://github.com/aneldev/dynadux-history-middleware) Middleware for History, Undo/Redo and Restore Points
- [React Dynadux](https://github.com/aneldev/react-dynadux) Provider for Dynadux App Stores
- [Change Log](doc/Change-Log.md) Changes of Dynadux per semver version
- [🏠 Home, Contents](../README.md#table-of-contents)
