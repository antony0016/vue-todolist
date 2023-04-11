<template>
    <el-row class="w-screen h-screen" justify="center">
        <el-col :span="22" :lg="18" :md="20" class="h-screen">
            <navbar/>
            <router-view></router-view>
        </el-col>
    </el-row>
</template>

<script setup lang="ts">
import Navbar from "./components/Navbar.vue";
</script>

<style scoped>

</style>
