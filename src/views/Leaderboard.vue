<template>
    <div class="max-w-5xl mx-auto px-4 py-12">
        <h1 class="text-4xl sm:text-5xl font-bold text-center text-violet-300 mb-10 drop-shadow">
            🏆 The Ultimate Quiz Leaderboard
        </h1>

        <div class="bg-gradient-to-br from-violet-900/30 to-gray-900/40 rounded-xl shadow-xl backdrop-blur-md border border-violet-700/20 overflow-hidden">
            <table class="min-w-full table-auto text-white">
                <thead class="bg-violet-800/40 text-violet-300 text-sm uppercase tracking-widest">
                    <tr>
                        <th class="py-4 px-6 text-left">Rank</th>
                        <th class="py-4 px-6 text-left">Username</th>
                        <th class="py-4 px-6 text-left">Score</th>
                        <th class="py-4 px-6 text-left">Quizzes Done</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(user, index) in leaderboard"
                        :key="user.id"
                        :class="getRowClass(index)"
                        class="transition hover:bg-violet-800/30"
                    >
                        <td class="py-4 px-6 font-bold text-lg">
                            <span v-if="index === 0">🥇</span>
                            <span v-else-if="index === 1">🥈</span>
                            <span v-else-if="index === 2">🥉</span>
                            <span v-else>#{{ index + 1 }}</span>
                        </td>
                        <td class="py-4 px-6 font-semibold text-violet-100 text-base">{{ user.username || 'Anonymous' }}</td>
                        <td class="py-4 px-6">{{ user.score }}</td>
                        <td class="py-4 px-6">{{ user.answered?.length || 0 }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="text-center text-sm text-gray-400 mt-6">
            🔄 Updated in real-time (refresh to see new scores)
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { collection, getDocs, query, orderBy } from 'firebase/firestore'
    import { db } from '../composables/useFirestore.js'

    const leaderboard = ref([])

    const getRowClass = (index) => {
        if (index === 0) return 'bg-yellow-600/20 font-bold text-yellow-300'
        if (index === 1) return 'bg-gray-400/20 font-bold text-gray-200'
        if (index === 2) return 'bg-orange-500/20 font-bold text-orange-300'
        return ''
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
        border-spacing: 0 0.3rem;
    }
</style>
