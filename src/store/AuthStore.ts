import {defineStore} from "pinia";
import {ElMessage} from "element-plus";
import baseAxios from "../axios";
import router from "../router";
import {AxiosResponse, AxiosError} from "axios";

const AuthStore = defineStore('auth-store', {
    state: () => ({
        userId: -1,
        users: [] as { id: number, username: string }[],
        token: {
            access: sessionStorage.getItem('token') as string | undefined,
        },
        urls: {
            users: '/users',
        },
        saveRoute: '/_',
    }),
    actions: {
        getUsers: async function () {
            return baseAxios.get(this.urls.users).then((response: AxiosResponse) => {
                this.users = response.data.data
            }).catch((error: AxiosError) => {
                ElMessage.error('發生錯誤，請重新登入')
                console.log(error)
                router.push('/login')
            })
        },
        getToken: async function (payload: { username: string, password: string }) {
            return baseAxios.post(this.urls.users + "/login", payload).then(async (response: AxiosResponse) => {
                let access = response.data.access as string
                let payloadString = atob(access.split('.')[1])
                let payloadJson = JSON.parse(payloadString)
                baseAxios.defaults.headers['authentication'] = 'bearer ' + access
                // save token and refresh to sessionStorage
                this.token.access = access
                // save user id
                this.userId = payloadJson.id
                sessionStorage.setItem('token', this.token.access)
                ElMessage.success('登入成功')
                await router.push('/')
            }).catch((error: AxiosError) => {
                console.log(error)
                ElMessage.error('登入失敗')
            })
        },
        verifyToken: async function (payload: { token: string }) {
            let access = payload.token as string
            if (!access || !access.includes('.')) {
                return false
            }
            return baseAxios.post(this.urls.users + "/verify", payload).then(() => {
                let payloadString = atob(access.split('.')[1])
                let payloadJson = JSON.parse(payloadString)
                this.userId = payloadJson.id
                return true
            }).catch((error: AxiosError) => {
                ElMessage.error('請重新登入')
                console.log(error)
                router.push('/login')
                return false
            })
        },
        register: async function (payload: { username: string, password: string }) {
            return baseAxios.post(this.urls.users + "/register", payload).then(async (response: AxiosResponse) => {
                console.log(response)
                ElMessage.success('註冊成功')
                return true
            }).catch((error: AxiosError) => {
                console.log(error)
                ElMessage.error('註冊失敗')
            })
        },
        logout: async function () {
            this.token.access = ''
            this.userId = -1
            sessionStorage.removeItem('token')
            sessionStorage.removeItem('refresh')
            ElMessage.info('登出成功')
            await router.push('/login')
        },
    }
})

export default AuthStore