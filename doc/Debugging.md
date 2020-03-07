[🔙 Back to the main page](../README.md)

# Dynadux - Debugging

# dynaduxDebugMiddleware

Dynandux comes with middleware for debugging that collects the dispatched actions in a global array.

Then from the debugger, you can access the dispatched actions with stats. 

_Still we don't have a nice debugger like Redux but we are working to make it happen. Feel free to contribute._

A big benefit not using a plugin debugger but only this middleware is the performance.
Plugging debuggers are crashing on a big amount of data since they scan your state.

Using this middleware, the CPU effort is only what you expand from the global array. 

## Usage

```
import {createStore, dynaduxDebugMiddleware} from "dynadux";

const store = createStore({
    initialState: {
        todos: [],
    },
    middlewares: [
        dynaduxDebugMiddleware(),
    ],
    reducers: {
        // ...
    },
});

```

`dynaduxDebugMiddleware` adds to the global array variable `dynaduxDebugMiddleware` all the dispatched items.

This middleware, like many other debugging tools, should not be on production since it would lead to a memory leak.

## API of dynaduxDebugMiddleware

As a parameter, it accepts a configuration object with this interface.

```
interface IDynaduxDebugMiddlewareConfig {
  globalVariableName?: string;
}
```

## globalVariableName

When you work with multiple stores it makes sense to save debugging info of the `dynaduxDebugMiddleware` in different global variables.

To load the middleware and save the array in different global name, for instance `debugState`, we can create the middleware like this:

`dynaduxDebugMiddleware({ globalVariableName: 'debugState '})`

# 🎉 Your training is done

Ones you reached this point you are mastering the Dynadux!

You can go further reading the Advanced but is not mandatory.

[⬅️ Middlewares](./Middlewares.md) 🔶 [React ➡️](./React.md) [Advanced ➡️](./Advanced.md) 

