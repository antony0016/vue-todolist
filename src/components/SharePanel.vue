<template>
    <el-card class="mt-3" shadow="never" body-style="flex-wrap: wrap;">
        <template #header>
            <span class="text-xl">Shares</span>
        </template>
        <div class="flex flex-wrap w-full">
            <el-card v-for="(share, index) in shares" class="text-xl mr-3"
                     shadow="never" :kay="index">
                <span class="w-full flex justify-between">
                    <span>{{ share.username }}</span>
                    <el-button @click="deleteShareHandler(share.id)" type="danger" text>
                        Delete
                    </el-button>
                </span>
            </el-card>

            <el-card class="w-auto text-xl" shadow="never" v-show="filterUsers.length">
                <span class="w-full flex justify-between">
                    <el-select v-model="choseUserId" default-first-option>
                        <el-option v-for="(user, index) in filterUsers"
                                   :value="user.id" :label="user.username" :key="index"/>
                    </el-select>
                    <el-button @click="sendShareHandler" type="success" text>
                        Add
                    </el-button>
                </span>
            </el-card>
        </div>
    </el-card>
</template>

<script setup lang="ts">
import TodoStore from "../store/TodoStore";
import AuthStore from "../store/AuthStore";
import {computed, onMounted, ref, toRefs} from "vue";

const todoStore = TodoStore()
const authStore = AuthStore()
const {sendShare, deleteShare} = todoStore
const {getUsers} = authStore
const {userId, users} = toRefs(authStore)
const {shares, groups, chosenGroup} = toRefs(todoStore)

const choseUserId = ref(-1);

const simpledShares = computed(() => {
    let result = groups.value.filter((group: any) => {
        return group.id === chosenGroup.value
    }).map(group => group.create_by)
    return shares.value.map((share: any) => {
        return share.user_id
    }).concat(result)
})

const filterUsers = computed(() => {
    return users.value.filter((user: any) => {
        return !simpledShares.value.includes(user.id) && user.id !== userId.value
    })
})

const sendShareHandler = () => {
    if (filterUsers.value.length === 0) return;
    sendShare({user_id: choseUserId.value});
}

onMounted(() => {
    getUsers().then(() => {
        if (filterUsers.value.length > 0) {
            choseUserId.value = filterUsers.value[0].id
        }
    })
})

const deleteShareHandler = (id: number) => {
    deleteShare({id}).then(() => {
        getUsers();
    })
}

</script>

<style scoped>

</style>