import { createWebHistory, createRouter } from 'vue-router'

import Home from '../views/Home.vue'
import Explore from '../views/Explore.vue'
import Profile from '../views/Profile.vue'
import Leaderboard from '../views/Leaderboard.vue'
import AuthForm from "../components/AuthForm.vue"
import Login from "../components/Login.vue"
import Quiz from "../views/Quiz.vue"


const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/explore',
        name: 'Explore',
        component: Explore
    },
    {
        path: '/profile',
        name: 'Profile',
        component: Profile
    },
    {
        path: '/leaderboard',
        name: 'Leaderboard',
        component: Leaderboard
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
    {
        path: '/quiz',
        name: 'quiz',
        component: Quiz
    },

]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;

