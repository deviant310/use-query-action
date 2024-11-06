# useQueryAction

# Мотивация

Хук представляет из себя фасад для React Query. Он упрощает взаимодействие с библиотекой и предоставляет единый интерфейс для всех запросов. Этот фасад  обрабатывает все необходимые конфигурации, сокращая объем шаблонного кода и делая использование библиотеки более простым.

# Быстрый старт

```tsx
const getTodos = async (): Promise<Array<{ id: number; title: string }>> => {
  return await fetch("https://jsonplaceholder.typicode.com/todos").then(
    (response) => response.json()
  );
};

const Todos = () => {
  const { data: todos, pending: gettingTodos } = useRequestAction(getTodos, []);

  return (
    <>
      {gettingTodos && "loading..."}

      {todos && todos.map((todo) => <div key={todo.id}>{todo.title}</div>)}
    </>
  );
};
```

# Как это работает

`useRequestAction` – это универсальный хук, с помощью которого можно отправлять запросы, и либо подписываться на обновления их данных, либо инициировать эти обновления в зависимости от способа отправки.

Хук умеет автоматически генерировать ключи для react-query.

# Использование

Запросы можно отправлять 2-мя способами. Способ отправки будет зависеть от переданных аргументов, в зависимости от них `useRequestAction` будет возвращать разный результат:

## **Отправка с помощью хука “подписчик”**

При таком способе вызова запрос будет выполнен сразу же при монтировании компонента и вызов хука подпишет компонент на обновления данных этого запроса. Для этого необходимо передать аргументы `action` вторым аргументом `useRequestAction`. Соответственно, если у `action` нет параметров – необходимо передать пустой массив. Опции передаются третьим аргументом.

```tsx
const requestActionSubscriberHookResult = useRequestAction(action, [], {});
```

где,

- `action` – асинхронная функция
- `args` – аргументы `action`
- `options` – опции

Параметры `action` и аргументы `action`, передаваемые в качестве второго аргумента `useRequestAction` немного отличаются. Несмотря на то, что `action` может иметь обязательные параметры, в качестве второго аргумента `useRequestAction` передается массив, где все обязательные параметры `action` могут быть `undefined`, но должны быть указаны явно. Запрос не будет выполнен (`enabled=false`) до тех пор, пока не будут переданы все обязательные параметры `action`

```tsx
// id is required parameter here
const getTodoById = async (id: number) => {/*...*/}

// but id can be undefined here
const [id, setId] = useState<number>();

// the interface of action params becomes [id: number | undefined]
// so this will work! getTodoById won't be executed while id=undefined
const { data: todo } = useRequestAction(getTodoById, [id], {});

// this call will define id, and getTodoById will be executed
setId(retrievedId);
```

Функция обработчик в результате вызова `useRequestAction` с передачей аргументов `action` представляет из себя синхронную функцию без возможности передачи аргументов `action`.

```tsx
import { getList } from './services'
const { perform: loadList } = useRequestAction(getList, []);
// ...
// just refetch
loadList();
```

### Опции

- `keepData` – если `true`, данные в кэше будут храниться вечно, если `false` данные будут удаляться из кэша при размонтировании компонента. Если не передано, то по умолчанию будет использоваться дефолтное время хранения данных в кэше (`cacheTime | gcTime`).
- `refetchOnMount` – если `true` только устаревшие данные будут перезапрашиваться при монтировании компонента, если `false` данные никогда не будут перезапрашиваться при монтировании компонента, если `always` данные всегда будут перезапрашиваться при монтировании компонента. По умолчанию `true`
- `pendingOnlyStale` – если `true`, то `pending` будет выставляться в `true` только в случае перезапроса устаревших данных. Если не передано, то по умолчанию `pending` это `isFetching`.

Для отправки запроса с подпиской в качестве первого аргумента `useRequestAction` следует передавать функцию верхнего уровня, либо мемоизированную функцию. Ключ, который создается во время вызова `useRequestAction` и по которому осуществляется доступ к кэшированным данным, привязывается к объекту функции. Передача анонимной функции приведет к тому, что каждый новый вызов будет генерироваться новый ключ. Кэширование при этом работать не будет.

## **Отправка с помощью хука “издатель”**

При таком способе вызова запрос выполняется вручную. В этом случае не передаются аргументы самого запроса.

```tsx
const requestActionEmitterHookResult = useRequestAction(action);
```

где,

- `action` – асинхронная функция

Функция обработчик в результате вызова `useRequestAction` без передачи аргументов `action` представляет из себя асинхронную функцию с возможностью передачи аргументов `action`.

```tsx
import { getById } from './services'
const { perform: loadById } = useRequestAction(getById);
// ...
// building arguments and fetching
await loadById(id);
```

Отправка запроса с помощью хука “издатель” просто выполнит запрос. Но если какой-то компонент был подписан на запрос с такими же параметрами – данные в этих компонентах обновятся.

## Примеры

### GET запрос

```tsx
import { getTodos } from './services'

const Todos = () => {
  const { data: todos, pending: gettingTodos } = useRequestAction(getTodos, []);

  return (
    <>
      {gettingTodos && "loading..."}

      {todos && todos.map((todo) => <div key={todo.id}>{todo.title}</div>)}
    </>
  );
};
```

### GET запрос c undefined параметрами

```tsx
import { getTodo } from './services'

const Todos = () => {
  const { id } = useParams<{ id: UUID }>(); // id is UUID | undefined, but it's OK!
  const { data: todo, pending: gettingTodo } = useRequestAction(getTodo, [id]);

  return (
    <>
      {gettingTodo && "loading..."}

      <div>{todo.title}</div>
    </>
  );
};
```

### Перезапрос данных в любом месте

```tsx
import { getTodoById } from './services'

const TodoReload = () => {
  const { perform: loadTodo, pending } = useRequestAction(getTodoById);

  /**
	 * All components subscribed to useRequestAction(getTodoById, [1]) will be updated
   */
  const onClick = useCallback(
	  () => loadTodo(1),
	  [loadTodos]
  );

  return (
    <button onClick={onClick} disabled={pending}>
      Reload todos
    </button>
  );
};
```

### POST запрос

```tsx
import { updateTodo } from './services'

const TodoView: FC<Props> = ({ id }) => {
  const { perform: updateTodo, pending: updatingTodo } =
    useRequestAction(updateTodo);

  const [name, setName] = useState("");

  const submit = useCallback(async () => {
    const { name: newName } = await updateTodo(id, { name });
  }, [updateTodo, name]);

  return (
    <>
      <input
        type="text"
        value={name}
        onChange={({ target }) => setName(target.value)}
        disabled={updatingTodo}
      />

      <button disabled={updatingTodo} onClick={submit}>Submit</button>
    </>
  );
};
```

### Перезапрос данных после POST запроса

```tsx
import { getTodo, updateTodo } from './services'

const useTodoUpdate = () => {
  const { perform: loadTodo } = useRequestAction(getTodo);

  const updateTodoAndReload = useCallback(
    async (id: number, data: Partial<Todo>) => {
      const updateResult = await updateTodo(id, data);

      loadTodo(id);

      return updateResult;
    },
    [loadTodo]
  );

  return useRequestAction(updateTodoAndReload);
};
```

### Обработка ошибок

```tsx
import { getTodos } from './services'

interface CustomError extends Error {
  reasons: Array<string>;
}

const TodosList = () => {
  const { toastError } = useToast();
  const { error } = useRequestAction<typeof getTodos, CustomError>(getTodos, []);

  useEffect(
    () => {
      if (error)
        toastError(
          error.reasons.join(', '),
          { caption: error.message }
        );
    },
    [toastError, error]
  );

  // ...
};
```
