<template>
    <NavBar/>

    <router-view v-slot="{ Component }">
        <transition>
            <component :is="Component"/>
        </transition>
    </router-view>
</template>

<script setup>
    import NavBar from './components/NavBar.vue'
</script>

<style scoped>
    .v-enter-from,
    .v-leave-to{
        opacity: 0;
    }

    .v-enter-active,
    .v-leave-active{
        transition: opacity 300ms ease-out;
    }
</style>
