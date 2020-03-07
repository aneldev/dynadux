import "jest";
import {createStore} from "../../src";

interface ITodoAppState {
  logged: boolean;
  todos: ITodo[];
  log: string[];
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
};

describe('Dynadux', () => {
  test('Dispatch actions with multi reducers', () => {
    let stateChanged = 0;

    const createTodoAppStore = (onChange: (state: ITodoAppState) => void) => {
      const store = createStore<ITodoAppState>({
        initialState: {
          logged: false,
          todos: [],
          log: [],
        },
        onChange,
        reducers: [
          {
            [actions.LOGIN]: ({action, state: {log}, payload: logged}) => {
              return {
                logged,
                log: log.concat(action + '--section-A'),
              };
            },
          },
          {
            [actions.LOGIN]: ({action, state: {log}, payload: logged}) => {
              return {
                logged,
                log: log.concat(action + '--section-B'),
              };
            },
            [actions.ADD_TODO]: ({action, state: {todos, log}, payload}) => {
              return {
                todos: todos.concat(payload),
                log: log.concat(action),
              };
            },
            [actions.REMOVE_TODO]: ({action, state: {todos, log}, payload: todoId}) => {
              return {
                todos: todos.filter(todo => todo.id !== todoId),
                log: log.concat(action),
              };
            },
          }
        ],
      });

      return {
        get state() {
          return store.state;
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

    expect(todoAppStore.state).toMatchSnapshot('First todos');

    todoAppStore.removeTodo('302');

    expect(todoAppStore.state).toMatchSnapshot('After remove of 302 todo');

    expect(stateChanged).toBe(4);
  });
});
