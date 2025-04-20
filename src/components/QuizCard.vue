<template>


  <!--Add three points that will displayed if u are a moderator to delete-->

  <div class="bg-gradient-to-br from-zinc-900 to-zinc-800 p-6 rounded-2xl border border-gray-700 shadow-lg hover:shadow-violet-500/20 transition-all duration-300 text-gray-100 w-full max-w-md mx-auto" @click.prevent="go_to_quiz(props.quiz.id)">
    <h3 class="text-2xl font-bold text-violet-400 font-winky mb-2">{{ props.quiz.Titre }}</h3>
    <p class="text-md text-gray-300 font-medium">
      Difficulty:
      <span
        :class="{
          'text-green-400': props.quiz.difficulty === 'easy',
          'text-yellow-300': props.quiz.difficulty === 'medium',
          'text-red-400': props.quiz.difficulty === 'hard'
        }"
        class="capitalize"
      >
        {{ props.quiz.difficulty }}
      </span>
    </p>
  </div>
</template>

<script setup>
import {useRouter} from "vue-router";

const router = useRouter()

const props = defineProps({
  quiz: {
    type: Object,
    required: true
  }
});

function go_to_quiz(quiz_id){
  router.push(`/quiz_ans/${quiz_id}`)
}





</script>

<style scoped>

</style>
