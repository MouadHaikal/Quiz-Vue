// src/firebase/fetchTrivia.js


//cette page a servi our remplir la database


import { db } from '../composables/useFirestore.js'; // adjust if needed
import { collection, addDoc } from 'firebase/firestore';
import { getDocs } from 'firebase/firestore';





export const fetchAndSaveTrivia = async (difficulty,category ) => {
  const response = await fetch(`https://opentdb.com/api.php?amount=10&difficulty=${difficulty}&category=${category}`);
  const data = await response.json();

  if (data.response_code !== 0) {
    throw new Error('Failed to fetch trivia');
  }

  const formattedQuestions = data.results.map(item => ({
    question: decodeHtml(item.question),
    options: shuffle([...item.incorrect_answers, item.correct_answer].map(decodeHtml)),
    answer: decodeHtml(item.correct_answer)
  }));

  const quiz = {
    Titre: formattedQuestions[0].question.slice(0,10).concat("..."),
    difficulty: difficulty,
    questions: formattedQuestions,
    category : category
  };

  const docRef = await addDoc(collection(db, 'Quizzes'), quiz);
  return docRef.id;
};

// Helper to decode HTML entities (like &quot; etc.)
function decodeHtml(html) {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

// Shuffle utility
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}


//le code en bas ne marche pas car il envoie plusieurs requte à la fois pour y remedier il faut essayer de mettre un intervale d'attente (sleep) entre les requetes

/*
export async function fetch_different_difficulties() {
  for (const diff of difficulties) {
    const fetches = [];

    for (let i = 0; i < 3; i++) {
      fetches.push(
        fetchAndSaveTrivia(diff)
          .then(() => console.log(`Saved quiz ${i + 1} for difficulty: ${diff}`))
          .catch(err => console.error(`Error on quiz ${i + 1} (${diff}):`, err))
      );
    }

    // Wait for all 3 fetches for current difficulty
    await Promise.all(fetches);
  }
}*/






function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retryFetchAndSave(difficulty, category, retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fetchAndSaveTrivia(difficulty, category);
    } catch (err) {
      console.warn(`Retry ${attempt + 1} failed for [${difficulty}] category ${category}`);
      await sleep(2000); // wait before retry
    }
  }
  throw new Error(`All retries failed for [${difficulty}] category ${category}`);
}

export async function fetch_different_difficulties() {
  const difficulties = [ 'easy','medium','hard'];
  const categories = Array.from({ length: 28 }, (_, i) => i + 9); // 9 to 36 inclusive

  for (const diff of difficulties) {
    for (const cat of categories) {
      for (let i = 0; i < 3; i++) {
        try {
          await retryFetchAndSave(diff, cat);
          console.log(` Saved quiz ${i + 1} for difficulty: ${diff}, category: ${cat}`);
        } catch (err) {
          console.error(`Final failure for quiz ${i + 1} (${diff}, category: ${cat}):`, err);
        }

        await sleep(8000); // Wait after each call
      }
      await sleep(2000); // Wait between categories
    }
  }

  console.log("🎉 All quizzes fetched and saved!");
}


// le fetch des quizz dans la base de donné


export const getQuizzes = async () => {
  try {
    console.log("Fetching quizzes...");
    const querySnapshot = await getDocs(collection(db, "Quizzes")); // Assuming collection is named "Quiz"

    if (querySnapshot.empty) {
      console.warn("No quizzes found.");
      return { fetchedQuizzes: [], error: null };
    }

    const quizzes = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log("Fetched quizzes:", quizzes);

    return { fetchedQuizzes: quizzes, error: null };
  } catch (error) {
    console.error("Error getting quizzes:", error);
    return { fetchedQuizzes: [], error };
  }
};




