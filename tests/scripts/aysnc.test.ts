import "jest";
import {createStore} from "../../src";

interface ITodoAppState {
  logged: boolean,
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
  ADD_TODO_LATER: 'ADD_TODO_LATER', // payload: IAddTodoLaterPayload
  REMOVE_TODO: 'REMOVE_TODO',       // payload: string (the id of a todo)
};

interface IAddTodoLaterPayload {
  todo: ITodo;
  withDelay: number;
}

describe('Dynadux', () => {
  test('Dispatch async actions', async (done) => {
    let stateChanged = 0;

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
          [actions.ADD_TODO_LATER]: ({payload, dispatch}) => {
            const {
              todo,
              withDelay = 0,
            }: IAddTodoLaterPayload = payload;

            setTimeout(() => {
              dispatch(actions.ADD_TODO, todo);
            }, withDelay);
          },
          [actions.REMOVE_TODO]: ({state: {todos}, payload: todoId}) => {
            return {
              todos: todos.filter(todo => todo.id !== todoId),
            };
          },
        },
      });

      return {
        get state() {return store.state; },
        login: (logged: boolean) => store.dispatch<boolean>(actions.LOGIN, logged),
        addTodo: (todo: ITodo) => store.dispatch<ITodo>(actions.ADD_TODO, todo),
        addTodoLater: (todo: ITodo, withDelay: number) => store.dispatch<IAddTodoLaterPayload>(actions.ADD_TODO_LATER, {todo, withDelay}),
        removeTodo: (todoId: string) => store.dispatch<string>(actions.REMOVE_TODO, todoId),
      };
    };

    const handleStateChange = (state: ITodoAppState) => {
      stateChanged++;
    };

    const todoAppStore = createTodoAppStore(handleStateChange);

    todoAppStore.login(true);
    todoAppStore.addTodo({id: '301', label: 'Before work beers', done: false});
    todoAppStore.addTodoLater({id: '302', label: 'Evening beer meeting', done: false}, 200);
    todoAppStore.addTodo({id: '303', label: 'After work beers', done: false});

    await new Promise(r => setTimeout(r, 300));

    expect(todoAppStore.state.todos.map(todo => todo.id).join()).toBe('301,303,302');
    expect(todoAppStore.state).toMatchSnapshot();

    expect(stateChanged).toBe(5);

    done();
  });
});
