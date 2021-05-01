[🏠 Home](../README.md)

# Dynadux - Sections

We can split a Store (aka App's State) into smaller states, the **Sections**.

A section is the same as the Store, but it changes only one Store's property, one Section.

The reducers of the Section cannot change the data of other sections.

Again a reducer can read data from other Sections through the instance of the Store but cannot write.

This restriction helps to make decoupled parts in the same Store. With sections, you can also add 3rd party solutions that cannot ruin your Store by mistake.

In this text is described all steps to write a store with sections.

[Full example](../tests/scripts/sections.test.ts)

# Principals

- Each Section is creating a property on the root level of the State.
- Reducers can access the State of this root property only.
- The provided State from a Section is the State of the root property.
- You can still access the entire Store.

# Example how to use them

Imagine we have a To-Do app with a user login feature.

**One Section is the User Authentication feature.** That keeps information if the user is logged in, the avatar of the user, etc.

**The other Section is the To-Do feature.** This is just a feature of our App.

These two sections and features are entirely decoupled. The concept is that the To-Do feature should work on any application decoupled from User Authorization.

On the application layer, when the user logged, the App will ask from the To-Do to fetch the to-do items for this user id.

# Steps to implement a complete Store with sections

## Summary

1. Create the sections
2. Implement the Section (enum actions, reducers, output business methods)
3. Create the `IAppState.ts`
4. Connect is the Store

We need only these files:

```
userAuthSection.ts  // Our sections
todoSection.ts
IAppState.ts        // Our entire App state
store.ts            // Our Business store

```

The Business store can expose the state `IAppState`, business methods, etc.., it is fully customizable.

## 1. Create the sections

Create the `userAuthSection.ts` file for the User Authentication section.

**File: `userAuthSection.ts`**
```
import {ICreateStoreAPI} from "dynadux";
import {IAppState} from "./IAppState.ts".

export interface IUserAuthState {
  logged: boolean;
  name: string;
  avatar: string;
  loggedAt: number;
}

const createUserAuthSection = (store: ICreateStoreAPI<IAppState>) => {
  const section = store.createSection<IUserAuthState>({
    section: 'userAuth',
    initialState: {
      logged: false,
      name: '',
      avatar: '',
      loggedAt: -1,
    },
    reducers: {
      [EUserActions.LOGIN]: ({payload}): Partial<IUserAuthState> => {
        const {
          name,
          avatar,
        }: ILOGIN_payload = payload;
        return {
          logged: true,
          name,
          avatar,
          loggedAt: Date.now(),
        };
      },
      [EUserActions.LOGOUT]: ({state: {logged}}): Partial<IUserAuthState> => {
        if (!logged) return; // Exit. No need to change anything.
        return {
          logged: false,
          name: '',
          avatar: '',
          loggedAt: -1,
        };
      },
      [EUserActions.UPDATE_AVATAR]: ({payload: avatar}) => ({avatar}),
    },
  });

  return {
    get state() {
      return section.state;
    },
    actions: {
      login: (name: string, avatar: string) => section.dispatch<ILOGIN_payload>(EUserActions.LOGIN, {name, avatar}),
      logout: () => section.dispatch(EUserActions.LOGOUT),
      updateAvatar: (avatar: string) => section.dispatch<string>(EUserActions.UPDATE_AVATAR, avatar),
    }
  };
};
```

**Note:** Here, we import the `IAppState` that we haven't created yet. We will do it next.

Let's create another section for the To-Do feature.

**File: `todoSection.ts`**
```
import {ICreateStoreAPI} from "dynadux";
import {IAppState} from "./IAppState.ts".

export interface ITodoState {
  todos: ITodo[];
  lastAddedTodo: number;
}

export interface ITodo {
  id: string;
  label: string;
  done: boolean;
}

enum ETodosActions {
  ADD_TODO = "ADD_TODO",            // payload: IADD_TODO_payload
  REMOVE_TODO = "REMOVE_TODO",      // payload: number: the id of the todo
  COMPLETE_TODO = "COMPLETE_TODO",  // payload: number: the id of the todo
}

interface IADD_TODO_payload {
  id: number;
  label: string;
}

const createTodosSection = (store: ICreateStoreAPI<IAppState>) => {
  const section = store.createSection<ITodoState>({
    section: 'todo',
    initialState: {
      todos: [],
      lastAddedTodo: -1,
    },
    reducers: {
      [ETodosActions.ADD_TODO]: ({state: {todos}, payload}): Partial<ITodoState> => {
        const {id, label}: IADD_TODO_payload = payload;
        return {
          todos: todos.concat({id, label, done: false}),
          lastAddedTodo: Date.now(),
        };
      },
      [ETodosActions.REMOVE_TODO]: ({state: {todos}, payload: id}): Partial<ITodoState> => {
        return {
          todos: todos.filter(todo => todo.id !== id),
        };
      },
      [ETodosActions.COMPLETE_TODO]: ({state: {todos}, payload: id}): Partial<ITodoState> => {
        return {
          todos: todos.map(todo => {
            if (todo.id === id) return ({...todo, done: true});
            return todo;
          }),
        };
      },
    },
  });

  return {
    get state() {
      return section.state;
    },
    actions: {
      addTodo: (id: number, label: string) => section.dispatch<IADD_TODO_payload>(ETodosActions.ADD_TODO, {id, label}),
      removeTodo: (id: number) => section.dispatch<number>(ETodosActions.REMOVE_TODO, id),
      completeTodo: (id: number) => section.dispatch<number>(ETodosActions.COMPLETE_TODO, id),
    }
  };
};
```
**Note:** Here, we import the `IAppState` that we haven't created yet. We will do it next.

## 3. Create the `IAppState.ts`

The App's State is created by the connection of the sections to our Store. This is happening on `store.ts`.

The App's State is a flat object that each key is the name of the `section`, and the value is the `state` of the Section.

The name of the Section is defined on each section creation on `section` property.

We create the `IAppState` interface, and we pass it to the `ICreateStoreAPI` for each Section, so each Section has the types of the other sections.

**File: `IAppState.ts`**

```
import {IUserAuthState} from "./userAuthSection";
import {ITodoState} from "./todoSection";

export interface IAppState {
  userAuth: IUserAuthState;
  todo: ITodoState;
}
```

## 4. Connect is the Store

Finally, let's create our Store connecting the sections.

_This is the easiest part!_


**File: `store.ts`**
```
import {IAppState} from "./todoSection";

import {createUserAuthSection} from "./userAuthSection";
import {createTodosSection} from "./todoSection";

export const createAppStore = () => {
  const store = createStore<IAppState>();

  return {
    user: createUserAuthSection(store),
    todos: createTodosSection(store),
  };
};

export interface IAppStore extends ReturnType<typeof createAppStore> {}

```

Here we export the `IAppStore`. This is the final Store.

In `Dynadux`, this is called a **Business Store** since it is not just a state but has methods as well, and it is a more business-oriented version of the Store.

The Object User of the Store, the App, doesn't need to know dispatch and actions! Just use the methods. This is the significant difference compared to Redux.

## Let's use it


```
import {createAppStore} from "./store";

// Create the app's store
const store = createAppStore(this.setState.bind(this));

// Call actions
store.todos.actions.addTodo(101, 'Before work beers');
store.todos.actions.addTodo(102, 'After work beers');
store.todos.actions.removeTodo(101);

// Access sections state
store.user.state          // The user's info
store.todos.state.todos   // The array with current todos

```

## Let's use it in React

[Use the `store` in React](https://github.com/aneldev/dynadux/blob/master/doc/React.md)

# API

## `createSection()`

The `createSection` methods require a config object of this interface:

```
ICreateSectionConfig<TSectionState> {
  section: string;
  initialState: TSectionState;
  reducers: IDynaduxReducerDic<TSectionState>;
}
```

The method returns an object of this interface:

```
ICreateSectionAPI<TSectionState> {
  storeState: TState;
  state: TSectionState;
  dispatch: <TPayload>(action: string, payload: TPayload): void;
}
```

Through the `storeState` getter, you can get the State of the Store.
That means that you can access one level up data that are unknown for the Section.

Keep in mind that accessing the Store's State makes the Section dependent on the App's state.
Keeping Section decoupled from the Store's State makes it reusable in other apps.

# Sum up

Sections help to create isolated state scopes.

Sections consisted of
- initial section state
- classic reducers
- the output of an API for being used from the App

We create a Dynadux store. As an App store, we return an object with the returned API of each Section.

[Full example](../tests/scripts/sections.test.ts)

# Continue

[⬅️ Middlewares](./API-Middlewares.md) 🔶 [Debugging ➡️](./API-Debugging.md)

[🏠 Home, Contents](../README.md#table-of-contents)
