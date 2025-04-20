import { db } from './useFirestore'
import { collection, addDoc } from 'firebase/firestore'

const categories = [
    // { id: 9, name: 'General Knowledge' },
    { id: 10, name: 'Books' },
    // { id: 11, name: 'Film' },
    { id: 12, name: 'Music' },
    { id: 17, name: 'Science & Nature' },
    { id: 18, name: 'Computers' },
    { id: 19, name: 'Mathematics' },
    { id: 21, name: 'Sports' },
    { id: 22, name: 'Geography' },
    { id: 23, name: 'History' },
    { id: 24, name: 'Politics' },
    { id: 27, name: 'Animals' }
]

const difficulties = ['easy', 'medium', 'hard']

function decodeHTMLEntities(str) {
    const txt = document.createElement('textarea')
    txt.innerHTML = str
    return txt.value
}

export async function populateQuizList() {
    for (const category of categories) {
        for (const difficulty of difficulties) {
            for (let i = 0; i < 5; i++) {
                const url = `https://opentdb.com/api.php?amount=10&category=${category.id}&difficulty=${difficulty}&type=multiple`

                try {
                    const res = await fetch(url)
                    const data = await res.json()

                    if (data.response_code !== 0 || data.results.length !== 10) {
                        console.warn(`⚠️ Skipping ${category.name} - ${difficulty} - quiz ${i + 1} (not enough data)`)
                        continue
                    }

                    const questions = data.results.map(q => ({
                        question: decodeHTMLEntities(q.question),
                        correct_answer: decodeHTMLEntities(q.correct_answer),
                        incorrect_answers: q.incorrect_answers.map(decodeHTMLEntities)
                    }))

                    await addDoc(collection(db, 'QuizList'), {
                        attempts: 0,
                        average_correct: 0,
                        category: category.name,
                        difficulty,
                        questions
                    })

                    console.log(`✅ Added quiz ${i + 1}/5: ${category.name} - ${difficulty}`)
                } catch (err) {
                    console.error(`❌ Error fetching ${category.name} - ${difficulty} - quiz ${i + 1}`, err)
                }
            }
        }
    }

    console.log('🎉 All quizzes added successfully!')
}
