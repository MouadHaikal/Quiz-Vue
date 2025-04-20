<template>
    <div v-if="quiz" class="max-w-3xl mx-auto px-6 py-16 text-gray-100">
        <h1 class="text-4xl font-bold mb-10 text-center text-violet-400">
            {{ quiz.category }}
            <span class="text-sm font-light text-gray-400 ml-2">({{ quiz.difficulty }})</span>
        </h1>

        <div
            v-if="currentQuestionIndex < quiz.questions.length"
            class="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 rounded-xl shadow-md space-y-10"
        >
            <div class="flex items-center justify-between text-sm text-gray-400 uppercase tracking-wide">
                <span>Question</span>
                <span class="font-semibold">{{ currentQuestionIndex + 1 }} / {{ quiz.questions.length }}</span>
            </div>

            <h2 class="text-2xl font-semibold text-amber-100 leading-snug">
                {{ currentQuestion.question }}
            </h2>

            <div class="grid sm:grid-cols-2 gap-5">
                <button
                    v-for="(option, index) in shuffledOptions"
                    :key="index"
                    @click="selectAnswer(option)"
                    class="transition-all duration-200 bg-violet-700 hover:bg-violet-600 px-6 py-3 rounded-lg text-left text-white font-medium focus:outline-none focus:ring-2 focus:ring-violet-400"
                >
                    {{ option }}
                </button>
            </div>
        </div>

        <div v-else class="text-center mt-16 space-y-8">
            <h2 class="text-3xl font-bold text-green-400">Quiz Completed</h2>
            <p class="text-lg text-gray-300">
                You answered
                <span class="text-white font-semibold">{{ correctCount }}</span>
                out of
                <span class="text-white font-semibold">{{ quiz.questions.length }}</span>
                correctly.
            </p>
            <button
                @click="submitScore"
                class="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg shadow-md transition-all duration-200"
            >
                Finish & Save Score
            </button>
        </div>
    </div>

    <div v-else class="text-center text-gray-300 py-20 text-xl animate-pulse">
        Loading quiz...
    </div>
</template>

<script setup>
    import { ref, computed, onMounted } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { doc, getDoc } from 'firebase/firestore'
    import { db } from '../composables/useFirestore'
    import { finishQuiz } from '../composables/finishQuizLogic'

    const route = useRoute()
    const router = useRouter()
    const quizId = decodeURIComponent(route.params.id)

    const quiz = ref(null)
    const currentQuestionIndex = ref(0)
    const correctCount = ref(0)
    const selected = ref(null)

    const currentQuestion = computed(() => quiz.value.questions[currentQuestionIndex.value])

    const shuffledOptions = computed(() => {
        if (!currentQuestion.value) return []
        const all = [...currentQuestion.value.incorrect_answers, currentQuestion.value.correct_answer]
        return all.sort(() => Math.random() - 0.5)
    })

    async function fetchQuiz() {
        const quizRef = doc(db, 'QuizList', quizId)
        const snap = await getDoc(quizRef)
        if (snap.exists()) {
            quiz.value = snap.data()
        } else {
            console.error('Quiz not found')
        }
    }

    function selectAnswer(option) {
        if (selected.value) return
        selected.value = option

        if (option === currentQuestion.value.correct_answer) {
            correctCount.value++
        }

        setTimeout(() => {
            selected.value = null
            currentQuestionIndex.value++
        }, 500)
    }

    async function submitScore() {
        await finishQuiz({ quizId, correctCount: correctCount.value })
        router.push('/explore')
    }

    onMounted(fetchQuiz)
</script>

<style scoped>
button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
</style>
