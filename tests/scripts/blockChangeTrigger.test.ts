import "jest";
import { createStore } from "../../src";

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
  ADD_TODO: 'ADD_TODO',             // payload: IADD_TODO_payload
  REMOVE_TODO: 'REMOVE_TODO',       // payload: string (the id of a todo)
};

interface IADD_TODO_payload {
  todo: ITodo;
  doNotChange?: boolean;
}

describe('Dynadux - Reducer, Block Change Trigger', () => {
  test('Block the change from inside a reducer', () => {
    let stateChanged = 0;

    const createTodoAppStore = (onChange: (state: ITodoAppState) => void) => {
      const dispatchedActions: { action: string, payload: any }[] = [];
      const store = createStore<ITodoAppState>({
        onChange,
        onDispatch: (action, payload) => dispatchedActions.push({action, payload}),
        initialState: {
          logged: false,
          todos: [],
        },
        reducers: {
          [actions.LOGIN]: ({payload: logged}) => {
            return {logged};
          },
          [actions.ADD_TODO]: ({state: {todos}, payload, blockChange}) => {
            const {
              todo,
              doNotChange = false,
            }: IADD_TODO_payload = payload;
            if (doNotChange) blockChange();
            return {
              todos: todos.concat(todo),
            };
          },
          [actions.REMOVE_TODO]: ({state: {todos}, payload: todoId}) => {
            return {
              todos: todos.filter(todo => todo.id !== todoId),
            };
          },
        },
      });

      return {
        get state() {
          return store.state;
        },
        get dispatchedActions() {
          return dispatchedActions;
        },
        login: (logged: boolean) => store.dispatch<boolean>(actions.LOGIN, logged),
        addTodo: (todo: ITodo, doNotChange = false) => store.dispatch<IADD_TODO_payload>(actions.ADD_TODO, {todo, doNotChange}),
        removeTodo: (todoId: string) => store.dispatch<string>(actions.REMOVE_TODO, todoId, {}),
      };
    };

    const handleStateChange = (state: ITodoAppState) => {
      stateChanged++;
    };

    const todoAppStore = createTodoAppStore(handleStateChange);

    expect(todoAppStore.state).toMatchSnapshot('Initial state');

    todoAppStore.login(true);
    todoAppStore.addTodo({id: '301', label: 'Before work beers', done: false}, true);
    todoAppStore.addTodo({id: '302', label: 'After work beers', done: false});

    expect(todoAppStore.state).toMatchSnapshot('First todos');

    todoAppStore.removeTodo('302');

    expect(todoAppStore.state).toMatchSnapshot('After remove of 302 todo');

    expect(stateChanged).toBe(3);

    expect(todoAppStore.dispatchedActions).toMatchSnapshot('Dispatched actions');
  });
});
