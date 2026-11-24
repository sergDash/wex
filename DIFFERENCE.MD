# Сравнительная таблица синтаксиса

Новичку сложно разобраться что выбрать из реактивных фреймворков, поэтому 
я предлагаю привести сравнительную таблицу синтаксиса каждого из них.

# Содержание

| Глава                                   | Замечания                      |
|-----------------------------------------|--------------------------------|
| [Wex 3](#wex-3)                         | Лучший шаблонизатор            |
| [jQuery](#jquery)                       | Императивный подход            |
| [Чистый JavaScript](#чистый-javascript) | Требует ручного создания HTML  |
| [Vue 3](#vue-3)                         | Лучший шаблонизатор            |
| [Alpine](#alpine)                       | Требует засорения HTML         |
| [React](#react)                         | Требует знать синтаксис JSX    |
| [Solid](#solid)                         | Требует знать синтаксис JSX    |
| [Svelte 5](#svelte-5)                   | Обязателен компилятор, нет CDN |
| [Knockout](#knockout)                   | Много ручного кода             |

## Wex 3

```html 
<template id="todo">
    <input w-bind="newTodo" placeholder="Новая задача..." />
    
    <button w-on="click:addTodo">Добавить</button>
    
    <div w-for="todo in todos" w-key="todo.id">
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

## jQuery 

```html 

<div id="todo">
    <input id="newTodo" placeholder="Новая задача..." />
    <button id="addTodo">Добавить</button>
    <div id="todos"></div>
</div>

<script>
    const state = {
        newTodo: '',
        todos: [],
    }

    function render() {
        $('#newTodo').val(state.newTodo)

        $('#todos').html(
                state.todos.map(todo => `
            <div>
                <span>${todo.text}</span>
                <button data-remove="${todo.id}">Удалить</button>
            </div>
        `).join('')
        )
    }

    function addTodo() {
        state.todos.push({
            id: Date.now(),
            text: state.newTodo,
        })

        state.newTodo = ''

        render()
    }

    function removeTodo(id) {
        state.todos = state.todos.filter(todo => todo.id !== id)

        render()
    }

    $('#newTodo').on('input', function () {
        state.newTodo = $(this).val()
    })

    $('#addTodo').on('click', addTodo)

    $('#todos').on('click', '[data-remove]', function () {
        removeTodo(Number($(this).attr('data-remove')))
    })

    render()
</script>
```

## Чистый JS

```html 

<div id="todo">
    <input id="newTodo" placeholder="Новая задача..." />
    <button id="addTodo">Добавить</button>
    <div id="todos"></div>
</div>

<script>
    const state = {
        newTodo: '',
        todos: [],
    }

    function addTodo() {
        state.todos.push({
            id: Date.now(),
            text: state.newTodo,
        })

        state.newTodo = ''

        render()
    }

    function removeTodo(id) {
        state.todos = state.todos.filter(todo => todo.id !== id)

        render()
    }

    function render() {
        document.querySelector('#newTodo').value = state.newTodo

        document.querySelector('#todos').innerHTML = state.todos
                .map(todo => `
            <div>
                <span>${todo.text}</span>
                <button data-remove="${todo.id}">Удалить</button>
            </div>
        `)
                .join('')
    }

    document.querySelector('#newTodo').addEventListener('input', e => {
        state.newTodo = e.target.value
    })

    document.querySelector('#addTodo').addEventListener('click', addTodo)

    document.querySelector('#todos').addEventListener('click', e => {
        const id = e.target.dataset.remove

        if (id) removeTodo(Number(id))
    })

    render()
</script>
```

## Vue 3

```html 

<template>
    <input v-model="newTodo" placeholder="Новая задача..." />

    <button @click="addTodo">Добавить</button>

    <div v-for="todo in todos" :key="todo.id">
        <span>{{ todo.text }}</span>
        <button @click="removeTodo(todo.id)">Удалить</button>
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    
    const newTodo = ref('')
    const todos = ref([])
    
    function addTodo() {
        todos.value.push({
            id: Date.now(),
            text: newTodo.value,
        })
    
        newTodo.value = ''
    }
    
    function removeTodo(id) {
        todos.value = todos.value.filter(todo => todo.id !== id)
    }
</script>
```


## Alpine

```html 

<div x-data="{
    newTodo: '',
    todos: [],

    addTodo() {
        this.todos.push({
            id: Date.now(),
            text: this.newTodo,
        })

        this.newTodo = ''
    },

    removeTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id)
    }
}">
    <input x-model="newTodo"
           placeholder="Новая задача..."
    />

    <button @click="addTodo">Добавить</button>

    <template x-for="todo in todos" :key="todo.id">
        <div>
            <span x-text="todo.text"></span>
            <button @click="removeTodo(todo.id)">
                Удалить
            </button>
        </div>
    </template>
</div>
```

## React 

```js
import { useState } from 'react'

function Todo() {
    const [newTodo, setNewTodo] = useState('')
    const [todos, setTodos] = useState([])

    function addTodo() {
        setTodos([...todos, {
            id: Date.now(),
            text: newTodo,
        }])

        setNewTodo('')
    }

    function removeTodo(id) {
        setTodos(todos.filter(todo => todo.id !== id))
    }

    return (
        <>
            <input
                value={newTodo}
                onChange={e => setNewTodo(e.target.value)}
                placeholder="Новая задача..."
            />

            <button onClick={addTodo}>Добавить</button>

            {todos.map(todo => (
                <div key={todo.id}>
                    <span>{todo.text}</span>
                    <button onClick={() => removeTodo(todo.id)}>
                        Удалить
                    </button>
                </div>
            ))}
        </>
    )
}

export default Todo
```

## Solid

```js 

import { createSignal, For } from 'solid-js'

function Todo() {
    const [newTodo, setNewTodo] = createSignal('')
    const [todos, setTodos] = createSignal([])

    function addTodo() {
        setTodos([
            ...todos(),
            {
                id: Date.now(),
                text: newTodo(),
            }
        ])

        setNewTodo('')
    }

    function removeTodo(id) {
        setTodos(todos().filter(todo => todo.id !== id))
    }

    return (
        <>
            <input
                value={newTodo()}
                onInput={e => setNewTodo(e.currentTarget.value)}
                placeholder="Новая задача..."
            />

            <button onClick={addTodo}>Добавить</button>

            <For each={todos()}>
                {todo => (
                    <div>
                        <span>{todo.text}</span>
                        <button onClick={() => removeTodo(todo.id)}>
                            Удалить
                        </button>
                    </div>
                )}
            </For>
        </>
    )
}

export default Todo
```

## Svelte 5

```html
<script>
    let newTodo = $state('')
    let todos = $state([])

    function addTodo() {
        todos.push({
            id: Date.now(),
            text: newTodo,
        })

        newTodo = ''
    }

    function removeTodo(id) {
        todos = todos.filter(todo => todo.id !== id)
    }
</script>

<input bind:value={newTodo} placeholder="Новая задача..." />

<button onclick={addTodo}>Добавить</button>

{#each todos as todo (todo.id)}
    <div>
        <span>{todo.text}</span>
        <button onclick={() => removeTodo(todo.id)}>
            Удалить
        </button>
    </div>
{/each}
```

## Knockout 

```html 

<div>
    <input
        data-bind="textInput: newTodo"
        placeholder="Новая задача..."
    />

    <button data-bind="click: addTodo">
        Добавить
    </button>

    <div data-bind="foreach: todos">
        <div>
            <span data-bind="text: text"></span>

            <button data-bind="click: $parent.removeTodo">
                Удалить
            </button>
        </div>
    </div>
</div>

<script>
function TodoViewModel() {
    const self = this

    self.newTodo = ko.observable('')

    self.todos = ko.observableArray([])

    self.addTodo = function () {
        self.todos.push({
            id: Date.now(),
            text: self.newTodo(),
        })

        self.newTodo('')
    }

    self.removeTodo = function (todo) {
        self.todos.remove(todo)
    }
}

ko.applyBindings(new TodoViewModel())
</script>
```