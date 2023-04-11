<template>
    <el-card shadow="never" class="mt-3">
        <template #header>
            <span class="flex w-full justify-between">
            <span class="text-xl">Groups</span>
            <el-button-group>
                <el-button @click="switchGroup">
                  <template #icon>
                    <el-icon>
                      <plus></plus>
                    </el-icon>
                  </template>
                </el-button>
                <el-button @click="switchEdit">
                  <template #icon>
                    <el-icon>
                        <edit-pen/>
                    </el-icon>
                  </template>
                </el-button>
            </el-button-group>
          </span>
        </template>
        <div class="flex flex-wrap text-center">
            <el-card shadow="never" v-for="(group, index) in groups" body-style="padding: 5px"
                     :group="group" :key="index" class="w-52 mr-3">
                <template #header>
                    <span class="text-xl">{{ group.id === chosenGroup ? "*" : "" }}</span>
                    <span :class="`${chosenGroup === group.id?'text-xl':''}`">{{ group.name }}</span>
                </template>
                <el-button class="w-full" @click="groupActionHandler(group.id)"
                           :type="actionButtonType(group.id)" text>
                    {{ isEdit ? "Delete" : "Choose" }}
                </el-button>
            </el-card>

            <el-card shadow="never" body-style="padding: 5px"
                     class="w-52 mr-3" v-show="addingGroup">
                <template #header>
                    <el-input placeholder="Type group name" v-model="newGroup.name"></el-input>
                </template>
                <el-button-group>
                    <el-button @click="sendGroupHandler" type="success">Add</el-button>
                    <el-button @click="switchGroup" type="danger">Close</el-button>
                </el-button-group>
            </el-card>
        </div>
    </el-card>
</template>

<script setup lang="ts">
import TodoStore from "../store/TodoStore";
import AuthStore from "../store/AuthStore";
import {onMounted, ref, toRefs} from "vue";
import {EditPen, Plus} from "@element-plus/icons-vue";

const authStore = AuthStore()
const {userId} = toRefs(authStore)

const todoStore = TodoStore()
const {getTodos, getGroups, sendGroup, deleteGroup, getShares} = todoStore
const {groups, chosenGroup} = toRefs(todoStore)

const addingGroup = ref(false)
const isEdit = ref(false)
const newGroup = ref({name: ""})

const switchGroup = (() => {
    addingGroup.value = !addingGroup.value
})

const switchEdit = (() => {
    isEdit.value = !isEdit.value
})

const sendGroupHandler = (() => {
    sendGroup({name: newGroup.value.name}).then(() => {
        switchGroup()
        newGroup.value.name = "";
    })
})

const actionButtonType = ((id: number) => {
    if (isEdit.value) return 'danger'
    return chosenGroup.value === id ? 'success' : 'info'
})

const groupActionHandler = (async (group_id: number) => {
    if (isEdit.value) {
        deleteGroup({group_id: group_id}).then(() => {
            switchEdit()
        })
    } else {
        chosenGroup.value = group_id
        await getTodos({group_id: group_id})
        await getShares({group_id: group_id})
    }
})

onMounted(() => {
    getGroups({user_id: userId.value});
})
</script>

<style scoped>

</style>