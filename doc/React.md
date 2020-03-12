[🏠 Home](../README.md)

# Dynadux - Redux

# How to use it in React apps/components

1. Create a `createAppStore`
2. On the body of the class declare `store = createAppStore(() => this.setState({}))`.
3. In the components use the `this.store.state` getter as a state or what ever your Business Store returns as State.
4. Use the exposed methods of the `this.store` to change the state

[Check out the Cart example](https://codesandbox.io/s/awesome-wozniak)

[See all examples](./Examples.md)

# Read more 

- [FAQ](./FAQ.md) Frequently asked questions
- [Examples](./Examples.md) Live examples. Examples compared to redux's implementations
- [Advanced](./Advanced.md) Dispached promises, boost up your app and more.
- [Terminology](./Terminology.md) Terminology of dynadux, (is small!).
- [History, Undo/Redo middleware](https://github.com/aneldev/dynadux-history-middleware) Middleware for History, Undo/Redo and Restore Points.
- [🏠 Home, Contents](../README.md#table-of-contents)
