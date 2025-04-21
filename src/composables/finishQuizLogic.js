import { doc, getDoc, updateDoc, increment, arrayUnion } from 'firebase/firestore'
import { db } from './useFirestore'
import { useUser } from './useUser'

export async function finishQuiz({ quizId, correctCount }) {
    const { currentUser } = useUser()
    const userId = currentUser.value?.uid

    if (!userId) {
        console.error('User not logged in')
        return
    }

    const quizRef = doc(db, 'QuizList', quizId)
    const quizSnap = await getDoc(quizRef)

    if (!quizSnap.exists()) {
        console.error('Quiz not found')
        return
    }

    const quizData = quizSnap.data()
    const difficulty = quizData.difficulty

    const multiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3
    const earnedPoints = correctCount * multiplier

    const userRef = doc(db, 'Users', userId)

    await updateDoc(userRef, {
        score: increment(earnedPoints),
        answered: arrayUnion(quizId)
    })

    const updatedAttempts = quizData.attempts + 1
    const totalCorrect = quizData.average_correct * quizData.attempts + correctCount
    const newAverageCorrect = totalCorrect / updatedAttempts

    await updateDoc(quizRef, {
        attempts: updatedAttempts,
        average_correct: newAverageCorrect
    })

    console.log(`✅ Quiz completed. ${earnedPoints} points awarded!`)
}
