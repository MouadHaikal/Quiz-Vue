<template>
    <div class="max-w-6xl mx-auto px-6 py-20">
        <h1 class="text-5xl sm:text-6xl text-center text-violet-200 mb-16 font-winky">
            <span class="font-quizano font-bold text-violet-400">Quizano</span> Rankings
        </h1>

        <div class="rounded-xl shadow-2xl overflow-hidden border border-violet-700/30 backdrop-blur-md bg-gradient-to-br from-gray-900/40 to-gray-800/30">
            <table class="min-w-full text-white text-sm sm:text-base">
                <thead class="bg-violet-900/30 text-violet-300 uppercase tracking-widest text-xs sm:text-sm">
                    <tr>
                        <th class="py-4 px-6 text-left">Rank</th>
                        <th class="py-4 px-6 text-left">Username</th>
                        <th class="py-4 px-6 text-left">Score</th>
                        <th class="py-4 px-6 text-left">Quizzes</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(user, index) in leaderboard"
                        :key="user.id"
                        :class="[getRowClass(index), 'transition duration-200']"
                    >
                        <td class="py-4 px-6 font-semibold text-base">
                            <span v-if="index === 0" class="text-yellow-400">#1</span>
                            <span v-else-if="index === 1" class="text-gray-300">#2</span>
                            <span v-else-if="index === 2" class="text-orange-300">#3</span>
                            <span v-else class="text-gray-400">#{{ index + 1 }}</span>
                        </td>
                        <td class="py-4 px-6 font-medium text-white">
                            {{ user.username || 'Anonymous' }}
                        </td>
                        <td class="py-4 px-6 text-violet-200 font-bold">
                            {{ user.score }}
                        </td>
                        <td class="py-4 px-6 text-gray-300">
                            {{ user.answered?.length || 0 }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <p class="text-center text-xs text-gray-500 mt-6 tracking-wide">
            Updated live — refresh for the latest rankings
        </p>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { collection, getDocs, query, orderBy } from 'firebase/firestore'
    import { db } from '../composables/useFirestore.js'

    const leaderboard = ref([])

    const getRowClass = (index) => {
        if (index === 0) return 'bg-yellow-500/10 text-yellow-100 font-semibold'
        if (index === 1) return 'bg-gray-400/10 text-gray-200 font-semibold'
        if (index === 2) return 'bg-orange-400/10 text-orange-100 font-semibold'
        return index % 2 === 0 ? 'bg-white/5 text-gray-200' : 'bg-white/0 text-gray-200'
    }

    async function fetchLeaderboard() {
        const usersRef = collection(db, 'Users')
        const q = query(usersRef, orderBy('score', 'desc'))
        const querySnap = await getDocs(q)

        leaderboard.value = querySnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))
    }

    onMounted(fetchLeaderboard)
</script>

<style scoped>
    table {
        border-collapse: separate;
        border-spacing: 0 0.4rem;
    }
</style>
