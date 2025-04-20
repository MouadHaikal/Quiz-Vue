<template>
    <div v-if="quiz" class="max-w-3xl mx-auto px-6 py-10 text-white">
        <h1 class="text-3xl font-bold mb-4">Quiz: {{ quiz.category }} ({{ quiz.difficulty }})</h1>

        <div v-if="currentQuestionIndex < quiz.questions.length" class="space-y-6">
            <h2 class="text-xl font-semibold">
                Question {{ currentQuestionIndex + 1 }} / {{ quiz.questions.length }}
            </h2>

            <p class="text-lg">{{ currentQuestion.question }}</p>

            <div class="grid grid-cols-2 gap-4 mt-4">
                <button
                    v-for="(option, index) in shuffledOptions"
                    :key="index"
                    class="bg-violet-800 px-4 py-2 rounded hover:bg-violet-700"
                    @click="selectAnswer(option)"
                >
                    {{ option }}
                </button>
            </div>
        </div>

        <div v-else class="text-center">
            <h2 class="text-2xl font-bold text-green-400 mb-4">Quiz Complete! 🎉</h2>
            <p>You got <span class="font-bold">{{ correctCount }}</span> out of {{ quiz.questions.length }} correct.</p>
            <button
                @click="submitScore"
                class="mt-6 px-6 py-3 bg-green-600 hover:bg-green-500 rounded text-white font-semibold"
            >
                Finish and Save Score
            </button>
        </div>
    </div>

    <div v-else class="text-center text-white py-10">Loading quiz...</div>
</template>

<script setup>
    import { ref, computed, onMounted } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { doc, getDoc } from 'firebase/firestore'
    import { db } from '../composables/useFirestore'
    import { finishQuiz } from '../composables/finishQuizLogic' // from previous step

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
        if (selected.value) return // prevent double clicks
        selected.value = option

        if (option === currentQuestion.value.correct_answer) {
            correctCount.value++
        }

        setTimeout(() => {
            selected.value = null
            currentQuestionIndex.value++
        }, 500) // small delay for feedback
    }

    async function submitScore() {
        await finishQuiz({ quizId, correctCount: correctCount.value })
        router.push('/explore') // or results page
    }

    onMounted(fetchQuiz)
</script>

<style scoped>
button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
</style>
