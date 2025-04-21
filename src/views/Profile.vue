<template>
    <div class="min-h-screen text-white px-4 py-16 flex justify-center">
        <div class="w-full max-w-3xl space-y-10">

            <div class="text-center">
                <h1 class="text-4xl font-bold tracking-tight text-violet-300">Profile</h1>
                <p class="text-gray-400 text-sm mt-1">Manage your account and view your stats</p>
            </div>

            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-md space-y-8">

                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 class="text-xl font-semibold">{{ userData.username }}</h2>
                        <p class="text-sm text-gray-400">{{ userData.email }}</p>
                    </div>
                    <span
                        v-if="userData.admin"
                        class="inline-block bg-yellow-400 text-black text-xs font-semibold px-3 py-1 rounded-md shadow-sm"
                    >
                        Admin
                    </span>
                </div>

                <div class="border-t border-slate-800 pt-6 space-y-4">
                    <label class="block text-sm text-gray-300">Change Username</label>
                    <div class="flex flex-col md:flex-row gap-3 md:items-center">
                        <input
                            v-model="editableUsername"
                            type="text"
                            class="flex-1 px-4 py-2.5 bg-slate-800 text-white border border-slate-700 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none transition placeholder-gray-500"
                            placeholder="New username"
                        />
                        <button
                            @click="saveChanges"
                            :disabled="loading || !editableUsername.trim() || editableUsername === userData.username"
                            class="bg-violet-600 hover:bg-violet-700 text-white font-medium px-4 py-2.5 rounded-lg transition disabled:opacity-50 cursor-pointer"
                        >
                            {{ loading ? 'Saving...' : 'Save' }}
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-slate-800 pt-6">
                    <div class="rounded-lg border border-slate-800 bg-slate-800/40 p-4">
                        <p class="text-sm text-gray-400 mb-1">Total Score</p>
                        <p class="text-2xl font-bold text-violet-200">{{ userData.score ?? 0 }}</p>
                    </div>
                    <div class="rounded-lg border border-slate-800 bg-slate-800/40 p-4">
                        <p class="text-sm text-gray-400 mb-1">Quizzes Completed</p>
                        <p class="text-2xl font-bold text-violet-200">{{ userData.answered?.length || 0 }}</p>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, watch } from 'vue'
    import { doc, getDoc, updateDoc } from 'firebase/firestore'
    import { db } from '../composables/useFirestore'
    import { useUser } from '../composables/useUser'

    const { currentUser, isUserInitialized } = useUser()

    const userData = ref({})
    const editableUsername = ref('')
    const loading = ref(false)

    async function fetchUserData() {
        if (!currentUser.value) return
        const userRef = doc(db, 'Users', currentUser.value.uid)
        const userSnap = await getDoc(userRef)
        if (userSnap.exists()) {
            userData.value = userSnap.data()
            editableUsername.value = userData.value.username || ''
        }
    }

    async function saveChanges() {
        if (!currentUser.value || !editableUsername.value.trim()) return

        loading.value = true

        try {
            const userRef = doc(db, 'Users', currentUser.value.uid)
            await updateDoc(userRef, {
                username: editableUsername.value.trim()
            })
            userData.value.username = editableUsername.value.trim()
        } catch (err) {
            console.error('Failed to update username:', err)
        } finally {
            loading.value = false
        }
    }

    onMounted(async () => {
        if (isUserInitialized.value) {
            await fetchUserData()
        } else {
            const unwatch = watch(isUserInitialized, async (ready) => {
                if (ready) {
                    await fetchUserData()
                    unwatch()
                }
            })
        }
    })
</script>
