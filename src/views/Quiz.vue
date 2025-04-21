<template>
    <div v-if="quiz" class="max-w-3xl mx-auto px-6 py-16 text-white">
        <div class="text-center mb-12">
            <h1 class="text-4xl font-bold text-violet-300">{{ quiz.category }}</h1>
            <p class="text-sm text-gray-400 mt-1">Difficulty: {{ quiz.difficulty }}</p>
        </div>

        <div v-if="currentQuestionIndex < quiz.questions.length" class="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg space-y-8">

            <div class="flex items-center justify-between text-xs text-gray-500 uppercase tracking-wider">
                <span>Question</span>
                <span class="font-semibold">{{ currentQuestionIndex + 1 }} / {{ quiz.questions.length }}</span>
            </div>

            <h2 class="text-2xl font-semibold text-amber-100 leading-snug">
                {{ currentQuestion.question }}
            </h2>

            <div class="grid sm:grid-cols-2 gap-4">
                <button
                    v-for="(option, index) in shuffledOptions"
                    :key="index"
                    @click="selectAnswer(option)"
                    :class="[
                        'cursor-pointer px-5 py-3 text-left rounded-lg font-medium transition-colors duration-200 border',
                        selected && option === currentQuestion.correct_answer ? 'bg-green-600/20 border-green-500 text-green-300' :
                            selected && option === selected && option !== currentQuestion.correct_answer ? 'bg-red-600/20 border-red-500 text-red-300' :
                                'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
                    ]"
                >
                    {{ option }}
                </button>
            </div>
        </div>

        <div v-else class="text-center mt-20 space-y-8">
            <h2 class="text-3xl font-bold text-violet-400">Quiz Completed</h2>
            <p class="text-lg text-gray-300">
                You answered
                <span class="text-white font-semibold">{{ correctCount }}</span>
                out of
                <span class="text-white font-semibold">{{ quiz.questions.length }}</span>
                correctly.
            </p>
            <button
                @click="submitScore"
                class="fancyButton fancyButton-purple"
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
        }, 800)
    }

    async function submitScore() {
        await finishQuiz({ quizId, correctCount: correctCount.value })
        router.push('/explore')
    }

    onMounted(fetchQuiz)
</script>
