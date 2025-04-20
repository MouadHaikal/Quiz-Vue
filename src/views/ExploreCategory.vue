<template>
    <div class="px-10 pb-6">
        <h1 class="text-4xl font-winky text-center font-bold my-12 text-violet-300">
            Quizzes for
            <span class="text-violet-400">{{ category }}</span>
        </h1>

        <div class="grid grid-cols-3 gap-6 w-5/6 mx-auto">
            <div
                v-for="quiz in quizzes"
                :key="quiz.id"
                class="p-4 border border-gray-600 text-gray-300  rounded bg-gray-800 hover:bg-gray-700 transition flex justify-between items-center"
                :class="{ 'opacity-70 bg-gray-950 pointer-events-none': !quiz.available }"
            >

                <div>
                    <div class="text-xl font-semibold">{{ quiz.difficulty }}</div>

                    <p class="text-sm mt-1">Attempts: {{ quiz.attempts }}</p>

                    <p class="text-sm mt-1">Avg. Correct: {{ quiz.average_correct }} / 10</p>
                </div>

                <router-link :to="`/quiz/${quiz.id}`" class="fancyButton fancyButton-purple flex items-center"
                    :disabled="!quiz.available"
                >
                    {{ quiz.available? 'Start Quiz':'Unavailable' }}
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { onMounted } from 'vue'
    import { useRoute } from 'vue-router'
    import { useQuizzes } from '../composables/useQuizList'
    import { useUser } from '../composables/useUser'

    const { currentUser, isUserInitialized } = useUser()
    const { quizzes, fetchByCategory } = useQuizzes()

    const route = useRoute()
    const category = decodeURIComponent(route.params.category)

    onMounted(async () => {
        // Wait until user is initialized before fetching quizzes
        while (!isUserInitialized.value) {
            await new Promise(resolve => setTimeout(resolve, 100))
        }

        if (currentUser.value) {
            await fetchByCategory(category, currentUser.value.uid)
        }
    })
</script>
