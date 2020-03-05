import "jest";
import {createStore} from "../../src";

interface ITodoAppState {
  logged: boolean;
  todos: ITodo[];
  stats: {
    all: number;
    completed: number;
    pending: number;
  };
}

interface ITodo {
  id: string;
  label: string;
  done: boolean;
}

const actions = {
  LOGIN: 'LOGIN',                   // payload: boolean
  ADD_TODO: 'ADD_TODO',             // payload: ITodo
  REMOVE_TODO: 'REMOVE_TODO',       // payload: string (the id of a todo)
  REFRESH_STATS: 'REFRESH_STATS',   // payload: -
};

describe('Dynadux', () => {
  test('Dispatch sync actions', () => {
    let stateChanged = 0;

    const createTodoAppStore = (onChange: (state: ITodoAppState) => void) => {
      const store = createStore<ITodoAppState>({
        initialState: {
          logged: false,
          todos: [],
          stats: {
            all: 0,
            completed: 0,
            pending: 0.
          },
        },
        onChange,
        reducers: {
          [actions.LOGIN]: ({payload: logged}) => {
            return {logged};
          },
          [actions.ADD_TODO]: ({state: {todos}, payload, dispatch}) => {
            dispatch(actions.REFRESH_STATS);
            return {
              todos: todos.concat(payload),
            };
          },
          [actions.REMOVE_TODO]: ({state: {todos}, payload: todoId, dispatch}) => {
            dispatch(actions.REFRESH_STATS);
            return {
              todos: todos.filter(todo => todo.id !== todoId),
            };
          },
          [actions.REFRESH_STATS]: ({state: {todos}, payload: todoId}) => {
            return {
              stats: {
                all: todos.length,
                completed: todos.filter(td => td.done).length,
                pending: todos.filter(td => td.done).length,
              }
            };
          },
        },
      });

      return {
        get state() {
          return store.state;
        },
        get stats() {
          return store.state.stats;
        },
        login: (logged: boolean) => store.dispatch<boolean>(actions.LOGIN, logged),
        addTodo: (todo: ITodo) => store.dispatch<ITodo>(actions.ADD_TODO, todo),
        removeTodo: (todoId: string) => store.dispatch<string>(actions.REMOVE_TODO, todoId),
      };
    };

    const handleStateChange = (state: ITodoAppState) => {
      stateChanged++;
    };

    const todoAppStore = createTodoAppStore(handleStateChange);

    expect(todoAppStore.state).toMatchSnapshot('Initial state');

    todoAppStore.login(true);
    todoAppStore.addTodo({id: '301', label: 'Before work beers', done: false});
    todoAppStore.addTodo({id: '302', label: 'After work beers', done: false});
    expect(todoAppStore.state.todos.map(todo => todo.id).join()).toBe('301,302');
    expect(todoAppStore.stats.all).toBe(2);

    expect(todoAppStore.state).toMatchSnapshot('First todos');

    todoAppStore.removeTodo('302');

    expect(todoAppStore.state).toMatchSnapshot('After remove of 302 todo');

    expect(stateChanged).toBe(7);
  });
});
