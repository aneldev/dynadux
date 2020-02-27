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
  ADD_TODO_LATER: 'ADD_TODO_LATER',
  REMOVE_TODO: 'REMOVE_TODO',
};

interface IAddTodoLaterPayload {
  todo: ITodo;
  withDelay: number;
}

describe('Dynadux, basics', () => {
  test('Dispatch async actions', async (done) => {
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
          [actions.ADD_TODO_LATER]: ({state, payload, dispatch}) => {
            const {
              todo,
              withDelay = 0,
            }: IAddTodoLaterPayload = payload;

            setTimeout(() => {
              dispatch(actions.ADD_TODO, todo);
            }, withDelay);

            return state;
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
        addTodo: (todo: ITodo) => store.dispatch<ITodo>(actions.ADD_TODO, todo),
        addTodoLater: (todo: ITodo, withDelay: number) => store.dispatch<IAddTodoLaterPayload>(actions.ADD_TODO_LATER, {todo, withDelay}),
        removeTodo: (todoId: string) => store.dispatch<string>(actions.REMOVE_TODO, todoId),
        getState: store.getState,
      };
    };

    const handleStateChange = (state: ITodoAppState) => {
      stateChanged++;
    };

    const todoAppStore = createTodoAppStore(handleStateChange);

    todoAppStore.addTodo({id: '301', label: 'Before work beers', done: false});
    todoAppStore.addTodoLater({id: '302', label: 'Evening beer meeting', done: false}, 200);
    todoAppStore.addTodo({id: '303', label: 'After work beers', done: false});

    await new Promise(r => setTimeout(r, 300));

    expect(todoAppStore.getState().todos.map(todo => todo.id).join()).toBe('301,303,302');
    expect(stateChanged).toBe(4);
    expect(todoAppStore.getState()).toMatchSnapshot();

    done();
  });
});
