import "jest";
import { createStore } from "../../src";

interface ITodoAppState {
  logged: boolean,
  todos: ITodo[];
  saved: boolean;
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
  SAVE_TODOS: 'SAVE_TODOS',         // payload: ISaveTodosPayload
  SAVED_TODOS: 'SAVED_TODOS',       // payload: none
};

interface ISaveTodosPayload {
  onSuccess: () => void;
  onFail: (error: any) => void;
}

describe('Dynadux', () => {
  test('Payloads with callbacks', async (done) => {
    let stateChanged = 0;

    const createTodoAppStore = (onChange: (state: ITodoAppState) => void) => {
      const store = createStore<ITodoAppState>({
        initialState: {
          logged: false,
          todos: [],
          saved: false,
        },
        onChange,
        reducers: {
          [actions.LOGIN]: ({payload: logged}) => {
            return {logged};
          },
          [actions.ADD_TODO]: ({state: {todos}, payload}) => {
            return {
              todos: todos.concat(payload),
              saved: false,
            };
          },
          [actions.REMOVE_TODO]: ({state: {todos}, payload: todoId}) => {
            return {
              todos: todos.filter(todo => todo.id !== todoId),
              saved: false,
            };
          },
          [actions.SAVE_TODOS]: ({state, payload, dispatch}) => {
            const {onSuccess, onFail}: ISaveTodosPayload = payload;
            setTimeout(() => { // Save the state.todos somewhere asynchronously
              dispatch(actions.SAVED_TODOS);
              onSuccess();
            }, 200);
          },
          [actions.SAVED_TODOS]: () => {
            return {saved: true};
          },
        },
      });

      return {
        get state() {
          return store.state;
        },
        login: (logged: boolean) => store.dispatch<boolean>(actions.LOGIN, logged),
        addTodo: (todo: ITodo) => store.dispatch<ITodo>(actions.ADD_TODO, todo),
        removeTodo: (todoId: string) => store.dispatch<string>(actions.REMOVE_TODO, todoId),
        saveTodos: (): Promise<void> => {
          return new Promise<void>((resolve, reject) => {
            store.dispatch<ISaveTodosPayload>(
              actions.SAVE_TODOS,
              {
                onSuccess: resolve,
                onFail: reject,
              },
            );
          });
        }
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

    expect(todoAppStore.state.saved).toBe(false);

    try {
      await todoAppStore.saveTodos();
    } catch (e) {
      console.error('Cannot save todos', e);
    }

    expect(todoAppStore.state.saved).toBe(true);

    expect(stateChanged).toBe(6);

    done();
  });
});
