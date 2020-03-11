[🏠 Home](../README.md)

# Dynadux - Examples

If you are already a Redux developer, you can compare the Redux versions with Dynadux versions.

Most of the examples are forked Redux examples and they are replaced with Dynadux.

Study all examples to learn the power of Dynadux.

# Table of Contents  
[Counter](#counter)  
[Todos](#Todos)  
[Shopping cart](#shoppingCart)  
[Shopping cart, combine reducers](#shoppingCartCombineReducers)  

<a name="counter"/>

## Counter

[Counter - Redux version](https://codesandbox.io/s/github/reduxjs/redux/tree/master/examples/counter)

[Counter - Replace Redux with Dynadux](https://codesandbox.io/s/festive-wright-jur7b)

[![Edit festive-wright-jur7b](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/festive-wright-jur7b?fontsize=14&hidenavigation=1&theme=dark)

With Dynadux, we don't need the react-redux (and redux of course).

This example demonstrates how you can replace Redux, **but, this is not the approach of Dynadux**.

**Changes:**
- reducers are much simpler, decoupled from "dispatch" logic 
- index.js is using now the Dynadux store

[Counter - Dynadux final version](https://codesandbox.io/s/amazing-bohr-xzhp0)

[![Edit amazing-bohr-xzhp0](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/amazing-bohr-xzhp0?fontsize=14&hidenavigation=1&theme=dark)

This is how Dynadux can be used.

**Changes:**
- the creation of the dynadux store is under the `stores/createCounterStore.js`
- the creation of the app store is done on the constructor
- also, on the constructor, we bind the `setState` method
- we use the `store.state` as a state
- the `createCounterStore` exposes business logic methods to update the state

<a name="todos"/>

## Todos

[Todos - Redux version](https://codesandbox.io/s/github/reduxjs/redux/tree/master/examples/todos)

[Todos - Dynadux version](https://codesandbox.io/s/dynadux-todo-9oiqn)

[![Edit dynadux-todo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/dynadux-todo-9oiqn?fontsize=14&hidenavigation=1&module=%2Fsrc%2Fcontainers%2FAddTodo.js&theme=dark)

With Dynadux
- The store is created in stores/createAppStore.js
- The store provides the state and business logic methods
- In containers, you don't need to dispatch anymore, simply use the business methods safely.
- It uses the existed reducers which are simplified
- The actions folder is not needed anymore
- The actions are bound with the reducers in stores/createAppStore.js in a cheap way
- The containers are much cleaner, are react components that make a mapping
- In containers, we can use the new business methods at any time (with redux you can't).
- The components remain intact since they are simply viewers
- The containers would be omitted!

<a name="shoppingCart"/>

# Shopping cart example

A real-world app. Shows how to create 2 sections of the app using the same store.

[Shopping cart - Redux version](https://codesandbox.io/s/github/reduxjs/redux/tree/master/examples/shopping-cart)

[Shopping cart - Dynadux version](https://codesandbox.io/s/clever-sun-xgdh7)

[![Edit clever-sun-xgdh7](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/clever-sun-xgdh7?fontsize=14&hidenavigation=1&module=%2Fsrc%2Fcontainers%2FApp.js&theme=dark)

#### 1. Creation of the store

In `stores/createAppStore.js` we create our Business Store.

The store imports only from the `reducers` folder. It combines the Sections of the app, the Products, and the Cart.

The `createAppStore` function returns an object with two properties. The value of each property is taken from the reducer file. 
There, each `getNNNSectionMethods` function returns an API that is used for the needs of each section.

For each Section of the App, the `createAppStore` needs
- the initial state
- the actions/reducers
- the API that will be exported 

#### 2. Implementation of Actions & Reducers

The whole store management is done in the reducers. 
Reducers are the functions that executed per action. 
So these are the functions that change the state of our store.

#### 3. Connect the Store the App

This is done in `containers/App.js` on the constructor.

#### 4. The use of the store

The store means the state.

Each section in our app has getters. 

To the fetch our Products from the back end we call `this.store.products.getAllProducts()`.

To the access and render the Products simply we call `this.store.products.products`, _this is a getter_.

To access the Total amount of out cart we call `this.store.cart.total`, _this is a getter_.

To check out and send the receipt to the backend we call `this.store.cart.checkout()`.

#### 5. Pass the API partially to the app

Now that we have a great API to handle the state of the app, pass it partially to the children Sections/Components. 

Do not pass the whole Store because this will lead to having a monolithic app. Pass only what is needed. 
_With Redux you tend to create monolithic apps since you can dispatch from any Container, any action!_.

<a name="shoppingCartCombineReducers"/>

# Shopping Cart example (combine reducers version)

[Cart example with multiple reducers](https://codesandbox.io/s/dynadux-shopping-cart-example-icygs)

[![Edit Dynadux Shopping cart example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/awesome-wozniak-icygs?fontsize=14&hidenavigation=1&module=%2Fsrc%2Fcontainers%2FApp.js&theme=dark)

The create store is different here, as `reducers` we pass the any array of two dictionaries of action/reducer pairs.

In this way, the `ADD_TO_CART` action exists in both Sections, Products and .
