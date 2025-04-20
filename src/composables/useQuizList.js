import { ref } from 'vue'
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore'
import { db } from './useFirestore'

const DIFFICULTY_SCORES = { easy: 1, medium: 2, hard: 3 }

export function useQuizzes() {
    const quizList = ref([])
    const unavailableQuizIds = ref([])

    // Fetch user's answered quizzes
    const fetchAnsweredQuizzes = async (userId) => {
        const userRef = doc(db, 'Users', userId)
        const userSnap = await getDoc(userRef)
        if (userSnap.exists()) {
            unavailableQuizIds.value = userSnap.data().answered || []
        }
    }

    // Fetch quizzes in a category
    const fetchByCategory = async (category, userId) => {
        await fetchAnsweredQuizzes(userId)

        const q = query(collection(db, 'QuizList'), where('category', '==', category))
        const snapshot = await getDocs(q)
        quizList.value = snapshot.docs.map(doc => {
            const quiz = { id: doc.id, ...doc.data() }
            quiz.available = !unavailableQuizIds.value.includes(doc.id)
            return quiz
        })
    }

    const totalAttempts = () => {
        return quizList.value.reduce((acc, quiz) => acc + (quiz.attempts || 0), 0)
    }

    const averageDifficulty = () => {
        if (!quizList.value.length) return 0
        const total = quizList.value.reduce((sum, quiz) => sum + DIFFICULTY_SCORES[quiz.difficulty], 0)
        return (total / quizList.value.length).toFixed(2)
    }

    const averageCorrectAnswers = () => {
        let total = 0
        let count = 0
        quizList.value.forEach(quiz => {
            if (typeof quiz.average_correct_score === 'number') {
                total += quiz.average_correct_score
                count += 1
            }
        })
        return count === 0 ? 0 : (total / count).toFixed(2)
    }

    const getCategoryStats = async (category) => {
        const q = query(collection(db, 'QuizList'), where('category', '==', category))
        const snapshot = await getDocs(q)
        const quizList = snapshot.docs.map(doc => doc.data())

        const totalAttempts = quizList.reduce((sum, quiz) => sum + (quiz.attempts || 0), 0)

        const difficultyAverage = quizList.length
            ? (quizList.reduce((sum, quiz) => sum + DIFFICULTY_SCORES[quiz.difficulty], 0) / quizList.length)
            : null

        const difficultyLabel = (() => {
            if (difficultyAverage === null) return 'N/A'
            if (difficultyAverage < 1.5) return 'Easy'
            if (difficultyAverage < 2.5) return 'Medium'
            return 'Hard'
        })()

        const avgCorrect = quizList.length
            ? (quizList.reduce((sum, quiz) => sum + (quiz.average_correct || 0), 0) / quizList.length).toFixed(2)
            : 'N/A'

        return {
            attempts: totalAttempts,
            difficulty: difficultyLabel,
            correct: avgCorrect
        }
    }

    return {
        quizzes: quizList,
        fetchByCategory,
        totalAttempts,
        averageDifficulty,
        averageCorrectAnswers,
        getCategoryStats
    }
}
