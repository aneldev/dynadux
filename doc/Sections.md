[🏠 Home](../README.md)

# Dynadux - Sections

Sections are new in 1.5.0 and help to create states for applications or big components. It is not required to use it.

Once we create a store, we can create a section that scopes on the specific root property of the Store's State.

The implementation of a Section is the same as of a Store.

The benefit of Sections is that reducers cannot access the state of the other sections or the state of the app.

[Full example](../tests/scripts/sections.test.ts)

# Principals

- Each Section is creating a property on the root level of State.
- Reducers can access the state of the root property only.
- The provided state from a Section is the state of the root property.
- You can still pass the entire state of the app manually, but this is not recommended.

# Example how to use them

Imagine we have a To-Do app with a user login feature.

One section is the User feature. That keeps information if the user is logged, the avatar of the user, etc..

Another section is the To-Do feature.

These two sections and features are completely decoupled. The concept is that the To-Do feature should work on any application decoupled from User Handling.

On the application layer, when the user logged, the app will ask from the To-Do to fetch the to-do items for this user id.

# Steps to work with Sections

_Examples are in Typescript_

### #1 The Create Section function

Create Section function is a function that 
- takes the created store as argument _and_
- returns a business API to use it later in the application.

From the passed store reference, we use the `createSection` function that requires:
- `section: string`, the name of the section
- `initialState`, the initial state of the section
- `reducers`, the reducers scoped the section

What is new here is only the `section` string. 
This will be the root property name in the Store's state. 
But in practice, we won't use it, because, in the end, the state will be accessed from the return of this function. 
_We will see that later._

Initial state and reducers are remaining the same as we learned in the previous chapters. There is nothing new to learn.
```
const createUserInfoSection = (store: ICreateStoreAPI) => {
  const section = store.createSection({
    section: 'userSection',
    initialState: {
      logged: false,
      name: '',
      avatar: '',
      loggedAt: '',
    },
    reducers: {
      [EUserActions.LOGIN]: ({payload}) => {
        const {
          name,
          avatar,
        }: ILOGIN_payload = payload;
        return {
          logged: true,
          name,
          avatar,
          loggedAt: "today",
        };
      },
      [EUserActions.LOGOUT]: ({state: {logged}}) => {
        if (!logged) return; // Exit. No need to change anything.
        return {
          logged: false,
          name: '',
          avatar: '',
          loggedAt: "today",
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

Let's create another one section for the To-Do feature.

```
const createTodosSection = (store: ICreateStoreAPI) => {
  const section = store.createSection<ITodosManagementState>({
    section: 'todosSection',
    initialState: {
      todos: [],
      lastAddedTodo: '',
    },
    reducers: {
      [ETodosActions.ADD_TODO]: ({state: {todos}, payload}) => {
        const {id, label}: IADD_TODO_payload = payload;
        return {
          todos: todos.concat({id, label, done: false}),
          lastAddedTodo: "today",
        };
      },
      [ETodosActions.REMOVE_TODO]: ({state: {todos}, payload: id}) => {
        return {
          todos: todos.filter(todo => todo.id !== id),
        };
      },
      [ETodosActions.COMPLETE_TODO]: ({state: {todos}, payload: id}) => {
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

### #2 The Create App Store function

This Create App Store
- requests an onChange callback to get notified for the changes
- returns an API to use the store.

The returned API will be directly the API of the Sections. 

So, we create the Dynadux store, with the classic `createStore`, but we don't pass reducers for the sections.

As an output of the function, we return a small API. For each Section, we create a property with the returned value of the create section function. The function of each section requires the Store to be attached to this store.

The function to create the app store:

```
const createAppStore = (onChange: (state: IAppState) => void) => {
  const store = createStore<IAppState>({
    onChange,
  });

  return {
    user: createUserInfoSection(store),
    todos: createTodosSection(store),
  };
};
```

That's all! The app´s store is nothing but a concatenation of Sections.

### #3 Usage of our app store

```
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

# `createSection()` API

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
That means that you can access one level up data are unknown for the Section. 
In some cases, this maybe needed.

Keep in mind that accessing the Store's State makes the Section dependent on the app's State.
Keeping Section decoupled from the Store's state makes it reusable in other apps. 

# Sum up

Sections help to create isolated state scopes.

Sections consisted of
- initial section state
- classic reducers
- the output of an API for being used from the app

We create a Dynadux store. As an App store, we return an object with the returned API of each Section.

[Full example](../tests/scripts/sections.test.ts)

# Continue

[⬅️ Middlewares](./Middlewares.md) 🔶 [Debugging ➡️](./Debugging.md) 

[🏠 Home, Contents](../README.md#table-of-contents)


