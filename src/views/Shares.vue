<template>
    <el-row>
        <el-col :span="24">
            <groups/>
        </el-col>
        <el-col :span="24">
            <share-panel></share-panel>
        </el-col>
    </el-row>
</template>

<script setup lang="ts">
import Groups from "../components/Groups.vue";
import SharePanel from "../components/SharePanel.vue";

</script>

<style scoped>

</style>