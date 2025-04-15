import { createWebHistory, createRouter } from 'vue-router'

import Home from '../views/Home.vue'
import Explore from '../views/Explore.vue'
import Profile from '../views/Profile.vue'
import Leaderboard from '../views/Leaderboard.vue'


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
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;
