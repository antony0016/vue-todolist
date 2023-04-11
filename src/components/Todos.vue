<template>
    <el-card shadow="never">
        <template #header>
          <span class="flex w-full justify-between">
            <span class="text-xl">Todos</span>
            <el-button @click="switchTodo">
              <template #icon>
                <el-icon>
                  <plus></plus>
                </el-icon>
              </template>
            </el-button>
          </span>
        </template>
        <div class="flex flex-wrap text-center">
            <el-card shadow="never" v-for="(todo, index) in todos"
                     body-style="padding: 10px" :key="index" class="w-full mt-3">
              <span class="flex justify-between">
                <span class="flex items-center">
                    <span class="text-xl">{{ todo.title }}</span>
                </span>
                <span v-if="todo.create_by === userId">
                  <el-button @click="completeTodoHandler(todo)"
                             :type="todo.completed?'success':'info'">
                      <template #icon>
                          <el-icon>
                            <circle-close v-show="!todo.completed"></circle-close>
                            <circle-check v-show="todo.completed"></circle-check>
                          </el-icon>
                      </template>
                    {{ todo.completed ? "Completed!" : "Mark Completed" }}
                  </el-button>
                <el-button @click="deleteTodoHandler(todo)" type="danger">Delete</el-button>
                </span>
                <span v-else :class="todo.completed?'text-green-400':'text-red-400'">
                    {{ todo.completed ? "Completed!" : "Not Completed" }}
                </span>
              </span>
            </el-card>

            <el-card shadow="never" body-style="padding: 10px"
                     class="w-full mt-3" v-if="addingTodo">
              <span class="flex justify-between align-middle">
                <span class="w-2/3 md:w-3/4">
                  <el-input v-model="newTodo.title" @keydown.enter="sendTodoHandler"
                            placeholder="Todo title"></el-input>
                </span>
                <span class="w-30">
                  <el-button @click="sendTodoHandler">Add</el-button>
                  <el-button @click="switchTodo" type="danger">Close</el-button>
                </span>
              </span>
            </el-card>

            <span class="w-full text-gray-500" v-show="todos.length === 0 && !addingTodo">
                <span class="w-full text-xl text-middle">No todos in this group</span>
            </span>
        </div>
    </el-card>
</template>

<script setup lang="ts">
import {Plus, CircleCheck, CircleClose} from "@element-plus/icons-vue";
import TodoStore from "../store/TodoStore";
import AuthStore from "../store/AuthStore";
import {ref, toRefs} from "vue";

const todoStore = TodoStore()
const authStore = AuthStore()
const {userId} = toRefs(authStore)
const {getTodos, sendTodo, completeTodo, deleteTodo} = todoStore
const {todos, chosenGroup} = toRefs(todoStore)

const addingTodo = ref(false)
const newTodo = ref({title: ""})

const switchTodo = (() => {
    addingTodo.value = !addingTodo.value
})

const sendTodoHandler = (() => {
    sendTodo({
        title: newTodo.value.title,
    }).then(() => {
        getTodos({group_id: chosenGroup.value})
        switchTodo()
        newTodo.value.title = ''
    })
})

const completeTodoHandler = (todo: {
    id: number,
    title: string,
    completed: boolean
}) => {
    completeTodo({
        id: todo.id,
        completed: todo.completed
    })
}

const deleteTodoHandler = (todo: {
    id: number,
    title: string,
    completed: boolean
}) => {
    deleteTodo({
        id: todo.id,
    })
}


</script>

<style scoped>

</style>