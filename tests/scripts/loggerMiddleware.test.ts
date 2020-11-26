import "jest";
import {
  createStore,
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
};

describe('Dynadux', () => {
  test('Middlewares', async (done) => {
    const createTodoAppStore = (onChange?: (state: ITodoAppState) => void) => {
      const store = createStore<ITodoAppState>({
        initialState: {
          todos: [],
        },
        middlewares: [
          false,
          undefined,
          null,
          {
            after: ({action, payload}) => {
              console.log('dispatch', new Date, action, payload);
            },
          }
        ],
        onChange,
        reducers: {
          [actions.ADD_TODO]: ({state: {todos}, payload}) => {
            return {
              todos: todos.concat(payload),
            };
          },
        },
      });

      return {
        get state() {
          return store.state;
        },
        addTodo: (todo: ITodo) => store.dispatch<ITodo>(actions.ADD_TODO, todo),
      };
    };

    const todoAppStore = createTodoAppStore();

    const cl = console.log;
    console.log = jest.fn();

    todoAppStore.addTodo({id: '301', label: 'Before work beers', done: false});
    todoAppStore.addTodo({id: '302', label: 'Evening beer meeting', done: false});
    todoAppStore.addTodo({id: '303', label: 'After work beers', done: false});

    expect(
      (console.log as any)
        .mock
        .calls
        .map((i: any[]) => i.filter(i => !(i instanceof Date)))
    ).toMatchSnapshot();

    console.log = cl;

    done();
  });
});
