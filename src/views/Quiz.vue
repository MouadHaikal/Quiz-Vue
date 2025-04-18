

<template>
  <div>
    <div class="mb-6">
      <select
        v-model="difficulty"
        class="block w-60 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-white"
      >
        <option value="0">All difficulties</option>
        <option value="1">Easy</option>
        <option value="2">Medium</option>
        <option value="3">Hard</option>
      </select>
    </div>

    <div v-if="loading" class="text-center text-gray-500">Loading quizzes...</div>
    <div v-else-if="errNetwork" class="text-center text-red-500">No internet connection.</div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
      <QuizCard
        v-for="(quiz_fetched, index) in filteredQuizzes"
        :key="index"
        :quiz="quiz_fetched"
      />
    </div>
  </div>
</template>



<script setup>
import QuizCard from "../components/QuizCard.vue";




import {getQuizzes} from "../composables/QuizFetch.js";
import {onMounted, ref,onBeforeUnmount,computed} from "vue";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from "../composables/useFirestore";

const quizzes = ref([])
const loading = ref(true);
const isAuth = ref(false);
const currentUsername = ref('');
const errNetwork = ref(!navigator.onLine);
const difficulty = ref("0")






const checkConnection = () => {
  errNetwork.value = !navigator.onLine;
};


onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    isAuth.value = !!user;

    if (user) {
      try {
        const userDocRef = doc(db, 'Users', user.uid);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          currentUsername.value = userSnap.data().username;
        } else {
          console.warn('No user document found in Firestore.');
        }
      } catch (err) {
        console.error('Erreur lors de la récupération du username:', err);
      }
    }
  });
});



onMounted(async () => {
  window.addEventListener("online", checkConnection);
  window.addEventListener("offline", checkConnection);

  checkConnection(); // initial check

  if (errNetwork.value) {
    loading.value = false;
    return;
  }

  try {
    const {fetchedQuizzes, error} = await getQuizzes();

    if (error) {
      if (error.code === "auth/network-request-failed") {
        errNetwork.value = true;
        return;
      }
    }

    quizzes.value = fetchedQuizzes || [];



  } catch (error) {
    console.error("Error fetching quizzes:", error);
    errNetwork.value = true;
  } finally {
    loading.value = false;
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("online", checkConnection);
  window.removeEventListener("offline", checkConnection);
});



const filteredQuizzes = computed(() => {
  if (difficulty.value === "0" || !difficulty.value) {
    return quizzes.value;
  }

  const diffMap = {
    "1": "easy",
    "2": "medium",
    "3": "hard"
  };

  return quizzes.value.filter(quiz => quiz.difficulty === diffMap[difficulty.value]);
});





</script>


<style scoped>

</style>