<template>
    <div class="px-10 pb-16">
        <h1 class="text-4xl font-bold text-center my-14 text-violet-300 font-winky">
            Quizzes for <span class="text-violet-400">{{ category }}</span>
        </h1>

        <div class="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8 w-11/12 max-w-6xl mx-auto">
            <div
                v-for="quiz in quizzes"
                :key="quiz.id"
                class="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-lg transition-all duration-200 hover:shadow-violet-500/30 hover:border-violet-400/30 flex flex-col justify-between min-h-[180px]"
                :class="{ 'opacity-60 bg-gray-950 pointer-events-none': !quiz.available }"
            >
                <div class="space-y-1">
                    <div class="text-lg font-semibold text-white">
                        {{ quiz.difficulty }}
                    </div>
                    <p class="text-sm text-gray-400">Attempts: {{ quiz.attempts }}</p>
                    <p class="text-sm text-gray-400">Avg. Correct: {{ quiz.average_correct }} / 10</p>
                </div>

                <div class="mt-6">
                    <router-link
                        :to="`/quiz/${quiz.id}`"
                        :disabled="!quiz.available"
                        class="inline-block px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                        :class="quiz.available 
                            ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-sm' 
                            : 'bg-gray-700 text-gray-400 cursor-not-allowed'"
                    >
                        {{ quiz.available ? 'Start Quiz' : 'Submitted' }}
                    </router-link>
                </div>
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
