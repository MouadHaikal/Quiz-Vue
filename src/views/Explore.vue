<template>
    <div class="w-full px-20 text-center">
        <div class="relative inline-block mt-7 p-8 text-center text-5xl font-winky text-violet-300 select-none">
            <div class="z-10 relative">
                First, select a <span class="text-violet-400 underline decoration-dashed">category</span>
            </div>

            <div class="absolute left-0 top-0 h-full w-full rounded-full bg-gradient-to-r from-gray-900 to-violet-950/50  blur-xl">
            </div>
        </div>

        <div class="relative">
            <div class="absolute inset-0 bg-gray-900/80 blur-3xl">

            </div>

            <div class="z-10 relative w-full grid grid-cols-4 grid-flow-row gap-7 mt-7 mb-32">
                <router-link v-for="category in categories" :key="category" 
                            class="category-card"
                            :to="`/explore/${encodeURIComponent(category)}`"
                >

                    <h1>{{ category }}</h1>

                    <hr class="fancy-hr" />

                    <div v-if="loadingCategories.has(category)" class="text-sm text-gray-400 mt-2">Loading...</div>

                    <div v-else-if="categoryStats[category]" class="w-2/3 font-winky text-gray-300">
                        <div class="flex justify-between mt-6">
                            <span class="font-semibold text-violet-300">Avg. Difficulty:</span>
                            <span
                                :class="{
                                    'text-green-400': categoryStats[category].difficulty == 'Easy',
                                    'text-yellow-400': categoryStats[category].difficulty == 'Medium',
                                    'text-red-400': categoryStats[category].difficulty == 'Hard',
                                }">
                                {{ categoryStats[category].difficulty }}
                            </span>
                        </div>

                        <div class="flex justify-between mt-6">
                            <span class="font-semibold text-violet-300">Total Attempts:</span>
                            <span>{{ categoryStats[category].attempts }}</span>
                        </div>

                        <div class="flex justify-between mt-6">
                            <span class="font-semibold text-violet-300">Avg. Correct:</span>
                            <span>{{ categoryStats[category].correct }} / 10</span>
                        </div>
                    </div>

                </router-link>
            </div>
        </div>

        <div class="w-full" v-if="isAdmin">
            <button @click.prevent="populateQuizList" class="fancyButton fancyButton-purple mb-20">
                Populate quiz list
            </button>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { useQuizzes } from '../composables/useQuizList'

    const { getCategoryStats } = useQuizzes()

    const categories = [
        'General Knowledge',
        'Books',
        'Film',
        'Music',
        'Science & Nature',
        'Computers',
        'Mathematics',
        'Sports',
        'Geography',
        'History',
        'Politics',
        'Animals'
    ]

    const categoryStats = ref({})
    const loadingCategories = ref(new Set())

    const loadCategoryStats = async () => {
        for (const category of categories) {
            loadingCategories.value.add(category)

            getCategoryStats(category).then(stats => {
                categoryStats.value[category] = stats
            }).finally(() => {
                    loadingCategories.value.delete(category)
                })
        }
    }

    onMounted(() => {
        loadCategoryStats()
    })

    import { populateQuizList } from '../composables/populateQuizList'
    import { useUser } from '../composables/useUser'
    const { isAdmin } = useUser();

</script>
