

<template>
  <div>
    <div v-if="loading" class="text-center text-gray-500">Loading quizzes...</div>
    <div v-else-if="errNetwork" class="text-center text-red-500">No internet connection.</div>
    <div v-else class="grid grid-cols-3 grid-flow-col gap-10">
      <QuizCard
        v-for="(quiz_fetched, index) in quizzes"
        :key="index"
        :quiz="quiz_fetched"
      />
    </div>
  </div>
</template>


<script setup>
import QuizCard from "../components/QuizCard.vue";


import {getQuizzes} from "../composables/QuizFetch.js";
import {onMounted, ref,onBeforeUnmount} from "vue";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from "../composables/useFirestore";

const quizzes = ref([])
const loading = ref(true);
const isAuth = ref(false);
const currentUsername = ref('');
const errNetwork = ref(!navigator.onLine);

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

</script>


<style scoped>

</style>