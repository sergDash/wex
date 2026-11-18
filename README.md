<img src="wex.png" style="margin-top: 10px; margin-bottom: 0; padding-bottom: 0">

# 🌀 Wex.

Wex - это реактивный фронтенд фреймворк с высокой производительностью. 
Подключай по CDN и забудь про сборщик. Работает с любым бэк-енд шаблонизатором.

## 🔌⚡ Подключение.

```html
<script src="https://cdn.jsdelivr.net/gh/wemmbley/wex@oxc-compiler/dist/wex.min.js"></script>
```

## ToDo пример

```html 
<template id="todo">
    <input w-bind="newTodo" placeholder="Новая задача..." />
    <button w-on="click:addTodo">Добавить</button>
    <div w-for="todo,index in todos traceby todo.id">
        <span>{{ todo.text }}</span>
        <button w-on="click:removeTodo(todo.id)">Удалить</button>
    </div>
</template>

<script>
    $('#todo')
        .state({
            newTodo: '',
            todos: [],
        })
        .method('addTodo', function (state) {
            state.todos.push({
                id: Date.now(),
                text: state.newTodo,
            })
            state.newTodo = ''
        })
        .method('removeTodo', function (state, id) {
            state.todos = state.todos.filter(todo => todo.id !== id);
        })
        .mount()
</script>
```

## Performance (18 прогонов: медиана)

| Сценарий                       | Wex        | Vue    | pReact    | Solid     |
|--------------------------------|------------|--------|-----------|-----------|
| Монтирование 2000 строк        | 25 ms      | 14 ms  | 🏆`11 ms` | 44ms      |         
| Правка каждой 10-й (200 строк) | 🏆`0.8 ms` | 5.8 ms | 5.4 ms    | 0.9ms     |         
| Reverse 2000 строк             | 🏆`12 ms`  | 17 ms  | 23 ms     | 67ms      |          
| Правка 1 строки                | 🏆`0.1 ms` | 5.8 ms | 5.4 ms    | 🏆`0.1ms` |         

<img src="./education/Картинки/Performance.png">

```
Для ручного запуска тестов зайдите в браузере в файл: dist/benchmark/Index.html
```