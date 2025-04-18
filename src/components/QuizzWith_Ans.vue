<template>
  <section class="w-full h-[40rem] mx-auto flex justify-center items-center py-20">
    <div class="bg-gradient-to-r from-[#0e0c1e] to-[#090a19] rounded-xl shadow-xl w-[80%] md:w-[50%] p-6 flex flex-col">
      <!-- Question Section -->
      <div class="flex justify-center mb-6">
        <div class="text-3xl font-semibold text-white">
          {{current_qst.question}}
        </div>
      </div>

      <!-- Divider -->
      <hr class="border-t-2 border-[#444655] my-4">

      <!-- Answers Section -->
      <div class="space-y-4">
        <div v-for= "(opt,index ) in current_qst.options" :key="index" @click.prevent="verify_ans(opt)" class="bg-gradient-to-r from-[#55aaff] to-[#1b2a3a] hover:from-[#1b2a3a] hover:to-[#55aaff] text-white text-xl py-3 rounded-md cursor-pointer transition-all duration-300">
          {{opt}}
        </div>

      </div>
    </div>
  </section>
</template>




<script setup>

import {onMounted, ref, reactive,onBeforeUnmount} from "vue";
import {getQuizById} from "../composables/QuizFetch.js";
import {useRouter} from "vue-router";
import {getAuth} from "firebase/auth";
import {update_after_quiz} from "../composables/useAuth.js";

const router = useRouter()






const props = defineProps({
  quiz_id : {
    type:String,
    required :true
  },

})

const current_qst = reactive({
  answer : "",
  options : [],
  question :""
})
const questions = ref([])
const pointer = ref(0)
const timeLeft = ref(10);
const timer = ref(null);


const user = ref(null)

const score = ref(0)

onBeforeUnmount(() => {
  clearInterval(timer.value);
});

const DELAY = 10;
function startTimer() {
  timeLeft.value = DELAY;
  clearInterval(timer.value);
  timer.value = setInterval(() => {
    timeLeft.value--;
    if (timeLeft.value <= 0) {
     move_next();
    }
  }, 1000);
}

const quiz = ref(null)
onMounted(async ()=>{
  getCurrentUser()
  quiz.value = await  getQuizById(props.quiz_id)
  if (quiz.value ) {
    questions.value = quiz.value.questions
    current_qst.question  = questions.value[pointer.value].question
    current_qst.options  = questions.value[pointer.value].options
    current_qst.answer  = questions.value[pointer.value].answer

    startTimer()


  }

  console.log("quizz : "+quiz.value.id)
  console.log("user : "+user.value.uid)
  })


function move_next(){

  if (pointer.value+1 < questions.value.length) {

    pointer.value++
    current_qst.question = questions.value[pointer.value].question
    current_qst.options = questions.value[pointer.value].options
    current_qst.answer = questions.value[pointer.value].answer
    startTimer()
  }
  else {
    update_after_quiz(user.value.uid,quiz.value.id,score.value)
    router.push("/quiz")
  }

}



function verify_ans(ans){
  if (ans === current_qst.answer){
    score.value++
  }
  move_next()

}


const getCurrentUser = () => {
  const auth = getAuth();
  user.value = auth.currentUser;
  console.log(user.value);
  return user.value;
};








</script>



<style scoped>
  .answer-button:hover {
    transform: scale(1.05);
  }

  .answer-button {
    transition: transform 0.3s ease, background 0.3s ease;
  }
</style>