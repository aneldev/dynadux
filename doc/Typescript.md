[🏠 Home](../README.md)

# Dynadux - Typescript

Not so much to say about Typescript and Dynadux. Dynadux is written in Typescript. 

Simple Ctrl-Click the Type, and your smart IDE will navigate you into the types of Dynadux.

Here are some tips and techniques.

# Get interface of `createAppStore`

The technique of the `createAppStore` that exports the API for the app is great because we don't have to declare the return interface for it.

But down the road, you might need that interface. 

To get the `interface` of it we will use some Typescript magic:

`interface IAppStoreApi extends ReturnType<typeof createAppStore> {}`

Now you can pass this type to nested Components or Providers.

# Read more 

- [FAQ](./FAQ.md) Frequently asked questions
- [React](./React.md) How to use it in react
- [Sections](doc/API-Sections.md) Create sections for applications or big components
- [Examples](./Examples.md) Live examples. Examples compared to redux's implementations
- [Advanced](./Advanced.md) Dispached promises, boost up your app and more.
- [History, Undo/Redo](https://github.com/aneldev/dynadux-history-middleware) Middleware for History, Undo/Redo and Restore Points.
- [React Dynadux](https://github.com/aneldev/react-dynadux) Provider for Dynadux App Stores
- [Changelog](./Changelog.md) Changes of Dynadux per semver version
- [🏠 Home, Contents](../README.md#table-of-contents)
