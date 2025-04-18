<template>
  <div class="bg-gradient-to-br from-zinc-900 to-zinc-800 p-6 rounded-2xl border border-gray-700 shadow-lg hover:shadow-violet-500/20 transition-all duration-300 text-gray-100 w-full max-w-md mx-auto">
    <h3 class="text-2xl font-bold text-violet-400 font-winky mb-2">{{ quiz.Titre }}</h3>
    <p class="text-md text-gray-300 font-medium">
      Difficulty:
      <span
        :class="{
          'text-green-400': quiz.difficulty === 'easy',
          'text-yellow-300': quiz.difficulty === 'medium',
          'text-red-400': quiz.difficulty === 'hard'
        }"
        class="capitalize"
      >
        {{ quiz.difficulty }}
      </span>
    </p>
  </div>
</template>

<script>
export default {
  props: {
    quiz: {
      type: Object,
      required: true
    }
  }
};
</script>

<style scoped>

</style>
