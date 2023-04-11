<template>
    <el-card shadow="never" class="w-full mt-2" v-show="logged"
             body-style="padding: 15px;display: flex;justify-content: space-between;">
        <div class="text-xl">Simple Todo List</div>
        <div>
            <el-button @click="toHome" text>Home pages</el-button>
            <el-button @click="toShares" text>Edit shares</el-button>
            <el-button @click="logoutHandler" type="danger" text> Logout</el-button>
        </div>
    </el-card>
  <!--  {{ token }}-->
</template>

<script setup lang="ts">
import AuthStore from "../store/AuthStore";
import {computed, toRefs} from "vue";
import router from "../router";

const authStore = AuthStore();
const {token} = toRefs(authStore);
const {logout} = authStore;

const toHome = () => {
    router.push("/");
};
const toShares = () => {
    router.push("/shares");
};


const logged = computed(() => {
    return !!token.value.access;
});

const logoutHandler = () => {
    logout();
};

</script>

<style scoped>
</style>