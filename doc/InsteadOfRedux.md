[🏠 Home](../README.md)

# Dynadux - Benefits instead of Redux

If you are familiar with Redux, these are the benefits you gain with Dynadux.

- Less boilerplate code.
- Dynadux creates stores with minimal effort.
- No complementary libs are required.
- Containers are Components in dynadux, and this enriches the lifecycle of the containers. 
- You can dispatch from containers at any time (not only on Redux's mapping times).
- Containers would be omitted!
- Dynadux's approach simplifies the use of the `store` and containers they are not needed!
- Create multiple stores easily, and every component would have its store.
- You can wrap a Store easily to a React Hook.
- Small stores mean that smaller parts of the app are rendered on a change.
- It is faster than Redux because it uses the related reducer and not all of them.
- It is faster than Mobx because it doesn't scan your state to make it observable.
- It encourages you to create Business Stores and not dispatch from containers.
- With Business Stores, any component cannot access the data, which can cause security issues.
- No need for [ducks](https://github.com/erikras/ducks-modular-redux), Business Stores is self-contained. 
- Better API for reducers and middlewares.
- No need for Thunk! `dispatch` is provided for all the reducers and middlewares.
- Middlewares have callbacks before and after the dispatch of the action.
- Dynadux implementation is super simple, it is only an `Object.assign()`.
- No need to read tons of documentation, just this text is enough to learn it.
- Since it is simple, there is no restricted design of your store.
- Easy to create Sub-Stores!
- Easy to have Stores per component to reduce the big renders!
- Easier tests, just mock network requests of the actions, not the store itself.
- Written in Typescript, supports types.

# Read more 

- [React](./React.md) How to use it in react
- [Examples](./Examples.md) Live examples. Examples compared to redux's implementations
- [Sections](./Sections.md) Create sections for applications or big components
- [Advanced](./Advanced.md) Dispached promises, boost up your app and more
- [Typescript](./doc/Typescript.md) Tips for Typescript implementations
- [Terminology](./Terminology.md) Terminology of dynadux, (is small!)
- [History, Undo/Redo](https://github.com/aneldev/dynadux-history-middleware) Middleware for History, Undo/Redo and Restore Points
- [React Dynadux](https://github.com/aneldev/react-dynadux) Provider for Dynadux App Stores
- [Changelog](./Changelog.md) Changes of Dynadux per semver version
- [🏠 Home, Contents](../README.md#table-of-contents)
