import "jest";
import {
  ICreateStoreAPI,
  createStore
} from "../../src/create/createStore";

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
  const changes: { state: IUserInfoState; action: string; payload: any; }[] = [];
  const section = store.createSection<IUserInfoState>({
    section: 'userSection',
    onChange: (state, action, payload) => changes.push({state, action, payload}),
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
    get changes() {
      return changes;
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
  const changes: { state: ITodosManagementState; action: string; payload: any; }[] = [];
  const section = store.createSection<ITodosManagementState>({
    section: 'todosSection',
    onChange: (state, action, payload) => changes.push({state, action, payload}),
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
    get changes() {
      return changes;
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
  clientId: string;
  userSection: IUserInfoState;
  todosSection: ITodosManagementState;
}

enum EAppActions {
  SET_CLIENT_ID = "SET_CLIENT_ID"
}

const createAppStore = () => {
  const changes: { state: IAppState; action: string; payload?: any }[] = [];
  const store = createStore<IAppState>({
    initialState: {
      clientId: '',
      userSection: null as any,
      todosSection: null as any,
    },
    reducers: {
      [EAppActions.SET_CLIENT_ID]: ({payload: clientId}) => {
        return {clientId};
      },
    },
    onChange: (state, action, payload) => changes.push({state, action, payload}),
  });

  return {
    get state() {
      return store.state;
    },
    get changes() {
      return changes;
    },
    setClientId: (clientId: string): void => store.dispatch<string>(EAppActions.SET_CLIENT_ID, clientId),
    user: createUserInfoSection(store),
    todos: createTodosSection(store),
  };
};


describe('Dynadux', () => {
  test('Working with Sections', () => {
    const store = createAppStore();

    expect(store.state).toMatchSnapshot('Initial state');

    store.user.actions.login('John', 'https://www.anel.co/user/928457123/profile-01.png');
    store.todos.actions.addTodo(101, 'Before work beers');
    store.todos.actions.addTodo(102, 'After work beers');

    store.setClientId('client-001');

    expect(store.state).toMatchSnapshot('First todos');

    store.todos.actions.removeTodo(101);

    expect(store.state).toMatchSnapshot('After remove of 101 todo');

    store.todos.actions.completeTodo(102);

    expect(store.state).toMatchSnapshot('After complete 102');

    store.setClientId('client-002');

    store.user.actions.updateAvatar('https://www.anel.co/user/928457123/profile-02.png');

    expect(store.state).toMatchSnapshot('After avatar update');

    store.setClientId('client-003');

    expect(store.changes).toMatchSnapshot('STORE-CHANGES');
    expect(store.user.changes).toMatchSnapshot('USER-SECTION-CHANGES');
    expect(store.todos.changes).toMatchSnapshot('TODO-SECTION-CHANGES');
  });
});
