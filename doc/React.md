[🔙 Back to the main page](../README.md)

# Dynadux - Redux

# How to use it in React apps/components

1. Create a `createAppStore`
2. On the constructor of the app component call this `this.store = createAppStore(this.setState.bind(this))`.
3. In the components use the `this.store.state` as a state
4. Use the exposed methods of the `this.store` to change the state

[Check out the Todos app example](https://codesandbox.io/s/sleepy-browser-mijt6)

[See all examples](./Examples.md)

# Continue

[⬅️ Debugging](../Debugging.md) 🔶 [Advanced ➡️](./Advanced.md) 

