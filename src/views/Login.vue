<template>
    <el-container class="flex justify-center align-middle h-full">
        <!--        <el-button @click="apiTestClick">Click me</el-button>-->
        <el-card class="h-fit w-1/2 lg:w-1/3 mt-52">
            <template #header>
        <span class="flex w-full justify-between">
          <span class="text-2xl font-NotoSansTCRegular font-bold">
            {{ isRegister ? '註冊' : '登入' }}
          </span>
          <span>
            <el-switch v-model="isRegister" active-text="註冊" inactive-text="登入"/>
          </span>
        </span>
            </template>
            <el-form-item>
                <el-input v-model="username">
                    <template #prepend>
                        <el-icon size="large">
                            <User></User>
                        </el-icon>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="password" :show-password="isPeek"
                          placeholder="請輸入密碼" @keydown.enter="login">
                    <template #prepend>
                        <el-icon size="large">
                            <Lock></Lock>
                        </el-icon>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item v-show="isRegister">
                <el-input v-model="rePassword" :show-password="isPeek"
                          placeholder="請再一次輸入密碼" @keydown.enter="login">
                    <template #prepend>
                        <el-icon size="large">
                            <RefreshRight/>
                        </el-icon>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="userAction" class="w-full">
                    {{ isRegister ? '註冊' : '登入' }}
                </el-button>
            </el-form-item>
        </el-card>
    </el-container>
</template>

<script setup lang="ts">
// import packages
import {ref} from "vue";
import {User, Lock, RefreshRight} from '@element-plus/icons-vue'
import {ElMessage} from "element-plus";

// import store
import AuthStore from "../store/AuthStore";

// store setting
const {getToken, register} = AuthStore()
const isPeek = ref(true)
const isRegister = ref(false)

// variable setting
const username = ref('')
const password = ref('')
const rePassword = ref('')

// function setting
const peekSwitch = () => {
    isPeek.value = !isPeek.value
}

const userAction = () => {
    if (isRegister.value) {
        userRegister()
    } else {
        login()
    }
}

const login = () => {
    getToken({
        username: username.value,
        password: password.value
    }).catch(err => {
        ElMessage.error('登入失敗')
        console.log(err)
    })
}

const userRegister = async () => {
    // console.log(password.value, rePassword.value)
    if (password.value !== rePassword.value) {
        ElMessage.error('兩次密碼不一致')
        return
    }
    await register({
        username: username.value,
        password: password.value
    }).then(() => {
        isRegister.value = false
    })
}

</script>

<style scoped>

</style>