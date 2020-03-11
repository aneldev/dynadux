import "jest";
import {
  createStore,
  dynaduxDebugMiddleware,
} from "../../src";

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

describe('Dynadux', () => {
  test('Middlewares', async (done) => {
    const createTodoAppStore = (onChange?: (state: ITodoAppState) => void) => {
      const store = createStore<ITodoAppState>({
        initialState: {
          todos: [],
        },
        middlewares: [
          dynaduxDebugMiddleware(),
        ],
        onChange,
        reducers: {
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
        get state() { return store.state; },
        addTodo: (todo: ITodo) => store.dispatch<ITodo>(actions.ADD_TODO, todo),
        addTodoLater: (todo: ITodo, withDelay: number) => store.dispatch<IAddTodoLaterPayload>(actions.ADD_TODO_LATER, {todo, withDelay}),
        removeTodo: (todoId: string) => store.dispatch<string>(actions.REMOVE_TODO, todoId),
      };
    };

    const todoAppStore = createTodoAppStore();

    todoAppStore.addTodo({id: '301', label: 'Before work beers', done: false});
    todoAppStore.addTodoLater({id: '302', label: 'Evening beer meeting', done: false}, 200);
    todoAppStore.addTodo({id: '303', label: 'After work beers', done: false});

    await new Promise(r => setTimeout(r, 300));

    const globalDynaduxDebugMiddleware = (process as any).dynaduxDebugMiddleware;

    expect(globalDynaduxDebugMiddleware.log[4].afterMs).toBeGreaterThan(180);

    expect(todoAppStore.state.todos.length).toBe(3);
    expect(globalDynaduxDebugMiddleware.log.length).toBe(5);

    globalDynaduxDebugMiddleware.set(2);
    expect(todoAppStore.state.todos.length).toBe(1);
    expect(globalDynaduxDebugMiddleware.log.length).toBe(5);

    globalDynaduxDebugMiddleware.set(4);
    expect(todoAppStore.state.todos.length).toBe(3);
    expect(globalDynaduxDebugMiddleware.log.length).toBe(5);

    globalDynaduxDebugMiddleware.dispatch('ADD_TODO', {id: '445', label: 'Drink a Debug beer'});
    expect(todoAppStore.state.todos.length).toBe(4);
    expect(todoAppStore.state.todos[3].id).toBe('445');
    expect(globalDynaduxDebugMiddleware.log.length).toBe(6);

    done();
  });
});
