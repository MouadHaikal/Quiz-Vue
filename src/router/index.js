import { createWebHistory, createRouter } from 'vue-router'

import Home from '../views/Home.vue'
import AuthForm from "../components/AuthForm.vue";
import Login from "../components/Login.vue";


const routes = [
    {
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/register',
        name: 'register',
        component: AuthForm
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    },

]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;
