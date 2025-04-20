// src/firebase/fetchTrivia.js

// Cette page a servi à remplir la database

import { db } from '../composables/useFirestore.js'; // adjust if needed
import { collection, addDoc, getDoc, doc, getDocs } from 'firebase/firestore';

// Category map
const openTriviaCategories = {
  9: "General Knowledge",
  10: "Entertainment: Books",
  11: "Entertainment: Film",
  12: "Entertainment: Music",
  13: "Entertainment: Musicals & Theatres",
  14: "Entertainment: Television",
  15: "Entertainment: Video Games",
  16: "Entertainment: Board Games",
  17: "Science & Nature",
  18: "Science: Computers",
  19: "Science: Mathematics",
  20: "Mythology",
};

// ✅ Reverse map (name -> ID) for API use
const categoryNameToId = Object.entries(openTriviaCategories).reduce((acc, [id, name]) => {
  acc[name] = id;
  return acc;
}, {});

// Fetch and store trivia
export const fetchAndSaveTrivia = async (difficulty, categoryName) => {
  const categoryId = categoryNameToId[categoryName];
  const response = await fetch(`https://opentdb.com/api.php?amount=10&difficulty=${difficulty}&category=${categoryId}`);
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
    Titre: formattedQuestions[0].question.slice(0, 50) + "...",
    difficulty: difficulty,
    questions: formattedQuestions,
    category: categoryName
  };

  const docRef = await addDoc(collection(db, 'QuizList'), quiz);
  return docRef.id;
};


function decodeHtml(html) {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}


function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Retry wrapper for fetch
async function retryFetchAndSave(difficulty, categoryName, retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fetchAndSaveTrivia(difficulty, categoryName);
    } catch (err) {
      console.warn(`Retry ${attempt + 1} failed for [${difficulty}] category ${categoryName}`);
      await sleep(2000);
    }
  }
  throw new Error(`All retries failed for [${difficulty}] category ${categoryName}`);
}


export async function fetch_different_difficulties() {
  const difficulties = ['easy', 'medium', 'hard'];
  const categoryNames = Object.values(openTriviaCategories);

  for (const diff of difficulties) {
    for (const catName of categoryNames) {
      for (let i = 0; i < 3; i++) {
        try {
          await retryFetchAndSave(diff, catName);
          console.log(`Saved quiz ${i + 1} for difficulty: ${diff}, category: ${catName}`);
        } catch (err) {
          console.error(`Final failure for quiz ${i + 1} (${diff}, category: ${catName}):`, err);
        }
        await sleep(8000);
      }
      await sleep(2000);
    }
  }

  console.log(" All quizzes fetched and saved!");
}


export const getQuizzes = async () => {
  try {
    console.log("Fetching quizzes...");
    const querySnapshot = await getDocs(collection(db, "Quizzes"));

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

// Fetch quiz by ID
export const getQuizById = async (id) => {
  try {
    console.log("Fetching quiz with Firestore doc ID:", id);
    const docRef = doc(db, "Quizzes", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Quiz found:", docSnap.data());
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.warn("Quiz not found for ID:", id);
      return null;
    }
  } catch (error) {
    console.error("Error fetching quiz:", error);
    throw error;
  }
};
