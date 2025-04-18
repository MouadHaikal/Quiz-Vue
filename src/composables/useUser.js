import { ref, readonly } from 'vue'
import { auth } from './useFirestore'
import { onAuthStateChanged } from 'firebase/auth'

const currentUser = ref(null)
const isUserInitialized = ref(false)

// One-time listener setup
onAuthStateChanged(auth, (user) => {
    currentUser.value = user
    isUserInitialized.value = true
})

// Export readonly to prevent external mutation
export function useUser() {
    return {
        currentUser: readonly(currentUser),
        isUserInitialized: readonly(isUserInitialized),
        isLoggedIn: readonly(ref(() => !!currentUser.value))
    }
}
