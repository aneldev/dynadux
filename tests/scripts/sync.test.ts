import "jest";
import {createStore} from "../../src";

interface ITodoAppState {
  todos: ITodo[];
}

interface ITodo {
  id: string;
  label: string;
  done: boolean;
}

const actions = {
  ADD_TODO: 'ADD_TODO',
  REMOVE_TODO: 'REMOVE_TODO',
};

describe('Dynadux', () => {
  test('Dispatch sync actions', () => {
    let stateChanged = 0;

    const createTodoAppStore = (onChange: (state: ITodoAppState) => void) => {
      const store = createStore<ITodoAppState>({
        initialState: {
          todos: [],
        },
        onChange,
        reducers: {
          [actions.ADD_TODO]: ({state, payload}) => {
            return {
              ...state,
              todos: state.todos.concat(payload),
            };
          },
          [actions.REMOVE_TODO]: ({state, payload: todoId}) => {
            return {
              ...state,
              todos: state.todos.filter(todo => todo.id !== todoId),
            };
          },
        },
      });

      return {
        get state() { return store.state; },
        addTodo: (todo: ITodo) => store.dispatch<ITodo>(actions.ADD_TODO, todo),
        removeTodo: (todoId: string) => store.dispatch<string>(actions.REMOVE_TODO, todoId),
      };
    };

    const handleStateChange = (state: ITodoAppState) => {
      stateChanged++;
    };

    const todoAppStore = createTodoAppStore(handleStateChange);

    expect(todoAppStore.state).toMatchSnapshot('Initial state');

    todoAppStore.addTodo({id: '301', label: 'Before work beers', done: false});
    todoAppStore.addTodo({id: '302', label: 'After work beers', done: false});

    expect(todoAppStore.state).toMatchSnapshot('First todos');

    todoAppStore.removeTodo('302');

    expect(todoAppStore.state).toMatchSnapshot('After remove of 302 todo');

    expect(stateChanged).toBe(3);
  });
});
