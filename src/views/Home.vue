<template>
    <el-row justify="center" :gutter="20">
        <el-col :span="24">
            <groups class="mt-2"></groups>
            <todos class="mt-2" v-if="chosenGroup !== -1"></todos>
        </el-col>
    </el-row>
</template>

<script lang="ts" setup>
import Groups from "../components/Groups.vue";
import Todos from "../components/Todos.vue";
import TodoStore from "../store/TodoStore";
import {toRefs} from "vue";

const todoStore = TodoStore()
const {chosenGroup} = toRefs(todoStore)

</script>

<style scoped>

</style>