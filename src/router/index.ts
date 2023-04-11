// import package
import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";
import AuthStore from "../store/AuthStore";


const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue'),
        meta: {
            requiredAuth: true
        }
    },
    {
        path: '/shares',
        name: 'Shares',
        component: () => import('../views/Shares.vue'),
        meta: {
            requiredAuth: true
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue')
    },
] as RouteRecordRaw[]


const router = createRouter({
    routes: routes,
    history: createWebHistory('/'),
})

router.beforeEach(async (to, from) => {
    const authStore = AuthStore()
    let access = authStore.token.access ? authStore.token.access : ''
    let needLogin = false
    let togo = '/'
    // first, check route meta
    if (to.meta.requiredAuth) {
        needLogin = await authStore.verifyToken({token: access})
    }
    if (authStore.saveRoute !== '/_') {
        togo = authStore.saveRoute
        authStore.saveRoute = '/_'
    }
    if (from.path === '/login' && to.path === '/login') {
        return needLogin ? false : togo
    }
})


export default router