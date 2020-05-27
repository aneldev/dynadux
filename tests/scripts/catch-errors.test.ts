import "jest";
import {createStore} from "../../src";

interface ITodoAppState {
  logged: boolean;
  todos: ITodo[];
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
  TEST_THROW: 'TEST_THROW',
};

describe('Dynadux', () => {
  test('Catch errors', () => {
    let stateChanged = 0;

    const originalConsole = (global as any).console;
    (global as any).console = {error: jest.fn()};

    const createTodoAppStore = (onChange: (state: ITodoAppState) => void) => {
      const store = createStore<ITodoAppState>({
        initialState: {
          logged: false,
          todos: [],
        },
        onChange,
        reducers: {
          [actions.LOGIN]: ({payload: logged}) => {
            return {logged};
          },
          [actions.ADD_TODO]: ({state: {todos}, payload}) => {
            return {
              todos: todos.concat(payload),
            };
          },
          [actions.REMOVE_TODO]: ({state: {todos}, payload: todoId}) => {
            return {
              todos: todos.filter(todo => todo.id !== todoId),
            };
          },
          [actions.TEST_THROW]: () => {
            throw new Error("Test error");
          },
        },
      });

      return {
        get state() { return store.state; },
        login: (logged: boolean) => store.dispatch<boolean>(actions.LOGIN, logged),
        addTodo: (todo: ITodo) => store.dispatch<ITodo>(actions.ADD_TODO, todo),
        removeTodo: (todoId: string) => store.dispatch<string>(actions.REMOVE_TODO, todoId),
        testThrow: () => store.dispatch(actions.TEST_THROW),
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
    todoAppStore.testThrow();
    expect(console.error).toBeCalled();

    expect(todoAppStore.state).toMatchSnapshot('First todos');

    todoAppStore.removeTodo('302');

    expect(todoAppStore.state).toMatchSnapshot('After remove of 302 todo');

    expect(stateChanged).toBe(4);

    (global as any).console = originalConsole;
  });
});
