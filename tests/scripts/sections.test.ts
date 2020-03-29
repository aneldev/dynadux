import "jest";
import {
  ICreateStoreAPI,
  createStore
} from "../../src/createStore/createStore";

// User Section store

interface IUserInfoState {
  logged: boolean;
  name: string;
  avatar: string;
  loggedAt: string;
}

enum EUserActions {
  LOGIN = "LOGIN",                  // payload: ILOGIN_payload
  LOGOUT = "LOGOUT",
  UPDATE_AVATAR = "UPDATE_AVATAR",  // payload: string: new url
}

interface ILOGIN_payload {
  name: string;
  avatar: string;
}

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

// Todos Section store

interface ITodosManagementState {
  todos: ITodo[];
  lastAddedTodo: string;
}

interface ITodo {
  id: number;
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

// App store

interface IAppState {
  userSection: IUserInfoState;
  todosSection: ITodosManagementState;
}

const createAppStore = (onChange: (state: IAppState) => void) => {
  const store = createStore<IAppState>({
    reducers: {},
    onChange,
  });

  return {
    get state() {
      return store.state;
    },
    user: createUserInfoSection(store),
    todos: createTodosSection(store),
  };
};


describe('Dynadux', () => {
  test('Working with Sections', () => {
    let stateChanged = 0;

    const store = createAppStore(state => stateChanged++);

    expect(store.state).toMatchSnapshot('Initial state');

    store.user.actions.login('John', 'https://www.anel.co/user/928457123/profile-01.png');
    store.todos.actions.addTodo(101, 'Before work beers');
    store.todos.actions.addTodo(102, 'After work beers');

    expect(store.state).toMatchSnapshot('First todos');

    store.todos.actions.removeTodo(101);

    expect(store.state).toMatchSnapshot('After remove of 101 todo');

    store.todos.actions.completeTodo(102);

    expect(store.state).toMatchSnapshot('After complete 102');

    store.user.actions.updateAvatar('https://www.anel.co/user/928457123/profile-02.png');

    expect(store.state).toMatchSnapshot('After avatar update');

    expect(stateChanged).toBe(6);
  });
});
