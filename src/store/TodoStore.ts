import {defineStore} from "pinia";
import {ElMessage} from "element-plus";
import baseAxios from "../axios";
import router from "../router";
import AuthStore from "./AuthStore";
import {AxiosResponse, AxiosError} from "axios";

const authStore = AuthStore()

const TodoStore = defineStore('todo-store', {
    state: () => ({
        chosenGroup: -1,
        groups: [] as { id: number, name: string, create_by: number }[],
        todos: [] as { id: number, title: string, completed: boolean, create_by: number, group_id: number }[],
        shares: [] as { id: number, group_id: number, user_id: number, username: string }[],
        urls: {
            groups: '/groups',
            shares: '/groups/shares',
            todos: '/todos',
        },
    }),
    actions: {
        getGroups: async function (payload: { user_id: number }) {
            return baseAxios.get(this.urls.groups + `/${payload.user_id}`).then((response: AxiosResponse) => {
                this.groups = response.data.data
                if (this.groups.length > 0) {
                    this.chosenGroup = this.groups[0].id
                }
                this.getTodos({group_id: this.chosenGroup});
                this.getShares({group_id: this.chosenGroup});
            }).catch((error: AxiosError) => {
                ElMessage.error('發生錯誤，請重新登入')
                console.log(error)
                router.push('/login')
            })
        },
        getTodos: async function (payload: { group_id: number }) {
            return baseAxios.get(this.urls.todos + `/${payload.group_id}`).then((response: AxiosResponse) => {
                this.todos = response.data.data
            }).catch((error: AxiosError) => {
                ElMessage.error('發生錯誤，請重新登入')
                console.log(error)
                router.push('/login')
            })
        },
        sendGroup: async function (payload: { name: string }) {
            return baseAxios.post(this.urls.groups, {
                name: payload.name,
                create_by: authStore.userId,
            }).then((response: AxiosResponse) => {
                if (response.status === 200) {
                    this.getGroups({user_id: authStore.userId})
                    ElMessage.success('新增成功')
                } else {
                    ElMessage.error('新增失敗')
                }
            }).catch((error: AxiosError) => {
                ElMessage.error('發生錯誤，請重新登入')
                console.log(error)
                router.push('/login')
            })
        },
        deleteGroup: async function (payload: { group_id: number }) {
            return baseAxios.delete(this.urls.groups + `/${payload.group_id}`).then((response: AxiosResponse) => {
                if (response.status === 200) {
                    this.getGroups({user_id: authStore.userId})
                    ElMessage.success('刪除成功')
                } else {
                    ElMessage.error('刪除失敗')
                }
            }).catch((error: AxiosError) => {
                ElMessage.error('發生錯誤，請重新登入')
                console.log(error)
                router.push('/login')
            })
        },
        sendTodo: async function (payload: { title: string }) {
            return baseAxios.post(this.urls.todos, {
                title: payload.title,
                group_id: this.chosenGroup,
                create_by: authStore.userId,
            }).then((response: AxiosResponse) => {
                if (response.data.data.id) {
                    this.getTodos({group_id: this.chosenGroup})
                } else {
                    ElMessage.error('新增失敗')
                }
            }).catch((error: AxiosError) => {
                ElMessage.error('發生錯誤，請重新登入')
                console.log(error)
                router.push('/login')
            })
        },
        completeTodo: async function (payload: { id: number, completed: boolean }) {
            let completed = payload.completed ? 0 : 1
            return baseAxios.patch(this.urls.todos + `/${payload.id}/complete/${completed}`).then((response: AxiosResponse) => {
                if (response.status === 200) {
                    this.getTodos({group_id: this.chosenGroup})
                    ElMessage.success('更新成功')
                } else {
                    ElMessage.error('更新失敗')
                }
            }).catch((error: AxiosError) => {
                ElMessage.error('發生錯誤，請重新登入')
                console.log(error)
                router.push('/login')
            })
        },
        deleteTodo: async function (payload: { id: number }) {
            return baseAxios.delete(this.urls.todos + `/${payload.id}`).then((response: AxiosResponse) => {
                if (response.status === 200) {
                    this.getTodos({group_id: this.chosenGroup})
                    ElMessage.success('刪除成功')
                } else {
                    ElMessage.error('刪除失敗')
                }
            }).catch((error: AxiosError) => {
                ElMessage.error('發生錯誤，請重新登入')
                console.log(error)
                router.push('/login')
            })
        },
        getShares: async function (payload: { group_id: number }) {
            let tooLongUrl = this.urls.shares + `/${payload.group_id}`
            return baseAxios.get(tooLongUrl).then((response: AxiosResponse) => {
                this.shares = response.data.data
            }).catch((error: AxiosError) => {
                ElMessage.error('發生錯誤，請重新登入')
                console.log(error)
                router.push('/login')
            })
        },
        sendShare: async function (payload: { user_id: number }) {
            return baseAxios.post(this.urls.shares, {
                group_id: this.chosenGroup,
                user_id: payload.user_id,
            }).then((response: AxiosResponse) => {
                if (response.data.data.id) {
                    this.getShares({group_id: this.chosenGroup})
                } else {
                    ElMessage.error('新增失敗')
                }
            }).catch((error: AxiosError) => {
                ElMessage.error('發生錯誤，請重新登入')
                console.log(error)
                router.push('/login')
            })
        },
        deleteShare: async function (payload: { id: number }) {
            return baseAxios.delete(this.urls.shares + `/${payload.id}`).then((response: AxiosResponse) => {
                if (response.status === 200) {
                    this.getShares({group_id: this.chosenGroup})
                    ElMessage.success('刪除成功')
                } else {
                    ElMessage.error('刪除失敗')
                }
            }).catch((error: AxiosError) => {
                ElMessage.error('發生錯誤，請重新登入')
                console.log(error)
                router.push('/login')
            })
        }
    }
})

export default TodoStore