<template>
    <section class="w-full min-h-screen mx-auto fade-edge pt-32 pb-20 text-gray-100">
        <div class="w-4/5 max-w-6xl mx-auto">
            <!-- Profile Header -->
            <div class="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
                <!-- Avatar Section -->
                <div class="size-40 rounded-full bg-gray-800/40 shadow-2xl shadow-gray-950 flex justify-center items-center relative group">
                    <div class="size-36 rounded-full bg-gray-800/30 shadow-2xl shadow-gray-950 flex justify-center items-center">
                        <div class="absolute size-24 bg-gradient-to-tr from-violet-600/60 to-purple-600/60 rounded-full blur-lg"></div>
                        <div v-if="userProfile.photoURL" class="size-32 rounded-full overflow-hidden">
                            <img :src="userProfile.photoURL" alt="Profile picture" class="w-full h-full object-cover" />
                        </div>
                        <div v-else class="size-32 rounded-full bg-gray-800/80 flex justify-center items-center">
                            <span class="text-5xl font-bold text-violet-300">{{ userInitial }}</span>
                        </div>
                        
                        <!-- Upload button overlay -->
                        <label for="profileImageUpload" class="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex justify-center items-center transition-opacity cursor-pointer" aria-label="Upload Profile Picture">
                            <input id="profileImageUpload" type="file" class="hidden" @change="uploadProfileImage" />
                            <div class="text-center">
                                <svg class="size-8 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                </svg>
                                <span class="text-sm mt-1 block">Upload</span>
                            </div>
                        </label>
                    </div>
                </div>

                <!-- User Info -->
                <div class="flex-1 text-center md:text-left">
                    <h1 class="text-4xl font-winky text-amber-100 mb-2">{{ userProfile.username || 'Username' }}</h1>
                    <p class="text-gray-400 mb-4">{{ userProfile.email || 'email@example.com' }}</p>
                    
                    <div class="flex flex-wrap gap-6 justify-center md:justify-start mt-4">
                        <div class="stats-card">
                            <span class="text-3xl font-bold text-violet-300">{{ userProfile.score || 0 }}</span>
                            <span class="text-gray-400">Total Score</span>
                        </div>
                        <div class="stats-card">
                            <span class="text-3xl font-bold text-teal-300">{{ quizzesTaken }}</span>
                            <span class="text-gray-400">Quizzes Taken</span>
                        </div>
                        <div class="stats-card">
                            <span class="text-3xl font-bold text-orange-300">{{ userRank }}</span>
                            <span class="text-gray-400">Rank</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tabs Navigation -->
            <div class="border-b border-gray-700 mb-8">
                <nav class="flex space-x-8">
                    <button 
                        @click="activeTab = 'activity'" 
                        :class="[
                            'py-4 px-1 font-medium text-lg border-b-2 transition-colors',
                            activeTab === 'activity' ? 'border-violet-400 text-violet-300' : 'border-transparent text-gray-400 hover:text-gray-300'
                        ]"
                    >
                        Activity
                    </button>
                    <button 
                        @click="activeTab = 'favorites'" 
                        :class="[
                            'py-4 px-1 font-medium text-lg border-b-2 transition-colors',
                            activeTab === 'favorites' ? 'border-violet-400 text-violet-300' : 'border-transparent text-gray-400 hover:text-gray-300'
                        ]"
                    >
                        Favorites
                    </button>
                    <button 
                        @click="activeTab = 'created'" 
                        :class="[
                            'py-4 px-1 font-medium text-lg border-b-2 transition-colors',
                            activeTab === 'created' ? 'border-violet-400 text-violet-300' : 'border-transparent text-gray-400 hover:text-gray-300'
                        ]"
                    >
                        Created Quizzes
                    </button>
                    <button 
                        @click="activeTab = 'settings'" 
                        :class="[
                            'py-4 px-1 font-medium text-lg border-b-2 transition-colors',
                            activeTab === 'settings' ? 'border-violet-400 text-violet-300' : 'border-transparent text-gray-400 hover:text-gray-300'
                        ]"
                    >
                        Settings
                    </button>
                </nav>
            </div>

            <!-- Tab Content -->
            <div class="min-h-[30rem]">
                <!-- Activity Tab -->
                <div v-if="activeTab === 'activity'" class="animate-fade-in">
                    <h2 class="text-3xl text-gray-300 mb-6">Recent Activity</h2>
                    
                    <div v-if="recentQuizzes.length > 0">
                        <div v-for="(quiz, index) in recentQuizzes" :key="index" class="mb-4 p-6 rounded-xl bg-gray-800/30 border border-gray-700 hover:border-violet-500/30 transition-colors">
                            <div class="flex justify-between items-center mb-2">
                                <h3 class="text-xl font-medium text-violet-300">{{ quiz.title }}</h3>
                                <span class="text-gray-400">{{ quiz.date }}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <div>
                                    <span class="text-orange-300 font-bold">{{ quiz.score }} points</span>
                                    <span class="text-gray-400 mx-2">•</span>
                                    <span class="text-gray-400">{{ quiz.correct }}/{{ quiz.total }} correct</span>
                                </div>
                                <button class="px-4 py-2 rounded-lg bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 transition-colors">
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div v-else class="text-center py-12">
                        <div class="size-20 rounded-full bg-gray-800/40 mx-auto mb-4 flex items-center justify-center">
                            <svg class="size-10 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 class="text-xl text-gray-300 mb-2">No recent quizzes</h3>
                        <p class="text-gray-400 mb-6">Start taking quizzes to see your activity here</p>
                        <router-link :to="{ name: 'Explore' }" class="fancyButton fancyButton-purple">
                            Explore Quizzes
                        </router-link>
                    </div>
                </div>

                <!-- Favorites Tab -->
                <div v-if="activeTab === 'favorites'" class="animate-fade-in">
                    <h2 class="text-3xl text-gray-300 mb-6">Favorite Quizzes</h2>
                    
                    <div v-if="favoriteQuizzes.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div v-for="(quiz, index) in favoriteQuizzes" :key="index" class="quiz-card">
                            <div class="h-40 rounded-t-xl bg-gradient-to-br from-violet-600/30 to-purple-700/30 flex items-center justify-center">
                                <div class="size-20 rounded-full bg-gray-800/40 flex items-center justify-center">
                                    <div class="size-14 rounded-full bg-gray-800/80 flex items-center justify-center">
                                        <svg class="size-8 text-violet-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div class="p-4 rounded-b-xl bg-gray-800/30 border-x border-b border-gray-700">
                                <h3 class="text-lg font-medium text-violet-300 mb-1">{{ quiz.title }}</h3>
                                <p class="text-gray-400 text-sm mb-3">{{ quiz.category }}</p>
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-400 text-sm">{{ quiz.questions }} questions</span>
                                    <button class="fancyButton fancyButton-purple text-sm py-1 px-3">
                                        Play
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div v-else class="text-center py-12">
                        <div class="size-20 rounded-full bg-gray-800/40 mx-auto mb-4 flex items-center justify-center">
                            <svg class="size-10 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                        </div>
                        <h3 class="text-xl text-gray-300 mb-2">No favorite quizzes yet</h3>
                        <p class="text-gray-400 mb-6">Add quizzes to your favorites to see them here</p>
                        <router-link :to="{ name: 'Explore' }" class="fancyButton fancyButton-purple">
                            Explore Quizzes
                        </router-link>
                    </div>
                </div>

                <!-- Created Quizzes Tab -->
                <div v-if="activeTab === 'created'" class="animate-fade-in">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-3xl text-gray-300">Created Quizzes</h2>
                        <button class="fancyButton fancyButton-orange">
                            Create New Quiz
                        </button>
                    </div>
                    
                    <div v-if="createdQuizzes.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div v-for="(quiz, index) in createdQuizzes" :key="index" class="quiz-card">
                            <div class="h-40 rounded-t-xl bg-gradient-to-br from-orange-600/30 to-amber-600/30 flex items-center justify-center">
                                <div class="size-20 rounded-full bg-gray-800/40 flex items-center justify-center">
                                    <div class="size-14 rounded-full bg-gray-800/80 flex items-center justify-center">
                                        <svg class="size-8 text-orange-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div class="p-4 rounded-b-xl bg-gray-800/30 border-x border-b border-gray-700">
                                <h3 class="text-lg font-medium text-orange-300 mb-1">{{ quiz.title }}</h3>
                                <p class="text-gray-400 text-sm mb-3">{{ quiz.category }}</p>
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-400 text-sm">{{ quiz.plays }} plays</span>
                                    <div class="flex gap-2">
                                        <button class="p-1 rounded hover:bg-gray-700/50 transition-colors">
                                            <svg class="size-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                            </svg>
                                        </button>
                                        <button class="p-1 rounded hover:bg-gray-700/50 transition-colors">
                                            <svg class="size-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div v-else class="text-center py-12">
                        <div class="size-20 rounded-full bg-gray-800/40 mx-auto mb-4 flex items-center justify-center">
                            <svg class="size-10 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </div>
                        <h3 class="text-xl text-gray-300 mb-2">You haven't created any quizzes yet</h3>
                        <p class="text-gray-400 mb-6">Create your first quiz and share it with friends</p>
                        <button class="fancyButton fancyButton-orange">
                            Create New Quiz
                        </button>
                    </div>
                </div>

                <!-- Settings Tab -->
                <div v-if="activeTab === 'settings'" class="animate-fade-in">
                    <h2 class="text-3xl text-gray-300 mb-6">Account Settings</h2>
                    
                    <div class="bg-gray-800/30 rounded-xl border border-gray-700 p-8 mb-8">
                        <h3 class="text-xl text-gray-300 mb-6">Profile Information</h3>
                        
                        <div class="space-y-6">
                            <div>
                                <label class="block text-gray-400 mb-2">Username</label>
                                <input 
                                    type="text" 
                                    v-model="formData.username" 
                                    class="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-100 focus:border-violet-400 focus:ring focus:ring-violet-400/20 focus:outline-none"
                                />
                            </div>
                            
                            <div>
                                <label class="block text-gray-400 mb-2">Email</label>
                                <input 
                                    type="email" 
                                    v-model="formData.email" 
                                    class="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-100 focus:border-violet-400 focus:ring focus:ring-violet-400/20 focus:outline-none"
                                    disabled
                                />
                                <p class="text-sm text-gray-400 mt-1">Email cannot be changed</p>
                            </div>
                            
                            <div>
                                <label class="block text-gray-400 mb-2">Bio</label>
                                <textarea 
                                    v-model="formData.bio" 
                                    rows="3"
                                    class="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-100 focus:border-violet-400 focus:ring focus:ring-violet-400/20 focus:outline-none"
                                ></textarea>
                            </div>
                            
                            <div class="flex justify-end">
                                <button 
                                    @click="saveProfile" 
                                    class="fancyButton fancyButton-purple"
                                    :disabled="isSaving"
                                >
                                    {{ isSaving ? 'Saving...' : 'Save Changes' }}
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-gray-800/30 rounded-xl border border-gray-700 p-8 mb-8">
                        <h3 class="text-xl text-gray-300 mb-6">Change Password</h3>
                        
                        <div class="space-y-6">
                            <div>
                                <label class="block text-gray-400 mb-2">Current Password</label>
                                <input 
                                    type="password" 
                                    v-model="passwordData.current" 
                                    class="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-100 focus:border-violet-400 focus:ring focus:ring-violet-400/20 focus:outline-none"
                                />
                            </div>
                            
                            <div>
                                <label class="block text-gray-400 mb-2">New Password</label>
                                <input 
                                    type="password" 
                                    v-model="passwordData.new" 
                                    class="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-100 focus:border-violet-400 focus:ring focus:ring-violet-400/20 focus:outline-none"
                                />
                            </div>
                            
                            <div>
                                <label class="block text-gray-400 mb-2">Confirm New Password</label>
                                <input 
                                    type="password" 
                                    v-model="passwordData.confirm" 
                                    class="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-100 focus:border-violet-400 focus:ring focus:ring-violet-400/20 focus:outline-none"
                                />
                            </div>
                            
                            <div class="flex justify-end">
                                <button 
                                    @click="changePassword" 
                                    class="fancyButton fancyButton-orange"
                                    :disabled="isChangingPassword"
                                >
                                    {{ isChangingPassword ? 'Changing...' : 'Change Password' }}
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-gray-800/30 rounded-xl border border-red-900/30 p-8">
                        <h3 class="text-xl text-red-300 mb-2">Danger Zone</h3>
                        <p class="text-gray-400 mb-6">Once you delete your account, there is no going back. Please be certain.</p>
                        
                        <button 
                            @click="showDeleteConfirm = true" 
                            class="px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Delete Account Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-gray-800 border border-gray-700 rounded-xl p-8 max-w-md w-full mx-4">
            <h3 class="text-2xl text-red-300 mb-4">Delete Account</h3>
            <p class="text-gray-300 mb-6">Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your quizzes, stats, and profile data.</p>
            
            <div class="flex justify-end gap-4">
                <button 
                    @click="showDeleteConfirm = false" 
                    class="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
                >
                    Cancel
                </button>
                <button 
                    @click="deleteAccount" 
                    class="px-4 py-2 rounded-lg bg-red-500/30 hover:bg-red-500/50 text-red-200 transition-colors"
                >
                    Delete My Account
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUser } from '../composables/useUser';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential, deleteUser } from 'firebase/auth';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage,db,auth } from '../composables/useFirestore'; // Import storage

// Get current user
const { currentUser } = useUser(); 

// User profile data
const userProfile = ref({
    username: '',
    email: '',
    score: 0,
    photoURL: null, // Ensure photoURL is initialized as null
    bio: '',
    answered: []
});

const formData = ref({
    username: userProfile.value.username || '',
    email: userProfile.value.email || '',
    bio: userProfile.value.bio || ''
});

const passwordData = ref({
    current: '',
    new: '',
    confirm: ''
});
const isSaving = ref(false);
const isChangingPassword = ref(false);
const showDeleteConfirm = ref(false);
const activeTab = ref('activity');

// Mock data (replace with real data from Firestore)
const recentQuizzes = ref([
    { title: 'Geography Masters', score: 450, correct: 9, total: 10, date: 'Apr 15, 2025' },
    { title: 'History Trivia', score: 320, correct: 8, total: 10, date: 'Apr 12, 2025' },
    { title: 'Science Quiz', score: 400, correct: 10, total: 10, date: 'Apr 10, 2025' }
]);
const favoriteQuizzes = ref([
    { title: 'Movie Trivia', category: 'Entertainment', questions: 10 },
    { title: 'World Capitals', category: 'Geography', questions: 15 },
    { title: 'Science Facts', category: 'Education', questions: 20 }
]);
const createdQuizzes = ref([
    { title: 'Vue.js Mastery', category: 'Programming', plays: 1243 },
    { title: 'JavaScript Fundamentals', category: 'Programming', plays: 873 }
]);

// Computed properties
const userInitial = computed(() => {
    if (userProfile.value.username) {
        return userProfile.value.username.charAt(0).toUpperCase();
    }
    return '?';
});

const quizzesTaken = computed(() => {
    return userProfile.value.answered ? userProfile.value.answered.length : 0;
});

// Toast notification function
function showToast(message, type) {
    console.log(`[${type.toUpperCase()}]: ${message}`);
}

// Fetch user data
onMounted(async () => {
    if (currentUser.value) {
        try {
            const userDoc = await getDoc(doc(db, "Users", currentUser.value.uid));
            if (userDoc.exists()) {
                userProfile.value = userDoc.data();
                formData.value = {
                    username: userProfile.value.username || '',
                    email: currentUser.value ? currentUser.value.email || '' : '',
                    bio: userProfile.value.bio || ''
                };
                
                // Load recent quizzes, favorites, and created quizzes from Firestore
                await loadUserQuizzes();
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
            showToast("Error loading profile data", "error");
        }
    }
});

// Load user quizzes data
async function loadUserQuizzes() {
    if (!currentUser.value) return;
    
    try {
        // Load recent quiz attempts
        const quizAttemptsRef = collection(db, "QuizAttempts");
        const userAttemptsQuery = query(quizAttemptsRef, where("userId", "==", currentUser.value.uid));
        const attemptsSnapshot = await getDocs(userAttemptsQuery);
        
        if (!attemptsSnapshot.empty) {
            recentQuizzes.value = attemptsSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    title: data.quizTitle,
                    score: data.score,
                    correct: data.correctAnswers,
                    total: data.totalQuestions,
                    date: new Date(data.timestamp.toDate()).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    })
                };
            }).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
        }
        
        // Load favorite quizzes
        if (userProfile.value.favorites && userProfile.value.favorites.length > 0) {
            const favoritesData = [];
            for (const quizId of userProfile.value.favorites) {
                const quizDoc = await getDoc(doc(db, "Quizzes", quizId));
                if (quizDoc.exists()) {
                    const quizData = quizDoc.data();
                    favoritesData.push({
                        id: quizDoc.id,
                        title: quizData.title,
                        category: quizData.category,
                        questions: quizData.questions.length
                    });
                }
            }
            favoriteQuizzes.value = favoritesData;
        }
        
        // Load created quizzes
        const quizzesRef = collection(db, "Quizzes");
        const createdQuizzesQuery = query(quizzesRef, where("createdBy", "==", currentUser.value.uid));
        const createdSnapshot = await getDocs(createdQuizzesQuery);
        
        if (!createdSnapshot.empty) {
            createdQuizzes.value = createdSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    title: data.title,
                    category: data.category,
                    plays: data.plays || 0
                };
            });
        }
    } catch (error) {
        console.error("Error loading quiz data:", error);
        showToast("Error loading quiz data", "error");
    }
}

// Handle profile image upload
async function uploadProfileImage(event) {
    if (!currentUser.value) return;
    
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.match('image.*')) {
        showToast("Please select an image file", "error");
        return;
    }
    
    try {
        const profileStorageRef = storageRef(storage, `profile-images/${currentUser.value.uid}`);
        await uploadBytes(profileStorageRef, file);
        const downloadURL = await getDownloadURL(profileStorageRef);
        
        // Update profile photo URL in Firestore
        await updateDoc(doc(db, "Users", currentUser.value.uid), {
            photoURL: downloadURL
        });
        
        userProfile.value.photoURL = downloadURL;
        showToast("Profile picture updated", "success");
    } catch (error) {
        console.error("Error uploading profile image:", error);
        showToast("Error uploading image", "error");
    }
}

// Save profile changes
async function saveProfile() {
    if (!currentUser.value) return;
    
    if (!formData.value.username.trim()) {
        showToast("Username cannot be empty", "error");
        return;
    }
    
    try {
        isSaving.value = true;
        
        await updateDoc(doc(db, "Users", currentUser.value.uid), {
            username: formData.value.username,
            bio: formData.value.bio
        });
        
        userProfile.value.username = formData.value.username;
        userProfile.value.bio = formData.value.bio;
        
        showToast("Profile updated successfully", "success");
    } catch (error) {
        console.error("Error updating profile:", error);
        showToast("Error updating profile", "error");
    } finally {
        isSaving.value = false;
    }
}

// Change password
async function changePassword() {
    if (!currentUser.value) return;
    
    // Validation
    if (!passwordData.value.current || !passwordData.value.new || !passwordData.value.confirm) {
        showToast("Please fill all password fields", "error");
        return;
    }
    
    if (passwordData.value.new !== passwordData.value.confirm) {
        showToast("New passwords don't match", "error");
        return;
    }
    
    if (passwordData.value.new.length < 6) {
        showToast("Password must be at least 6 characters", "error");
        return;
    }
    
    try {
        isChangingPassword.value = true;
        
        // Re-authenticate user
        const credential = EmailAuthProvider.credential(
            currentUser.value.email,
            passwordData.value.current
        );
        
        await reauthenticateWithCredential(auth.currentUser, credential);
        
        // Update password
        await updatePassword(auth.currentUser, passwordData.value.new);
        
        // Clear form
        passwordData.value = {
            current: '',
            new: '',
            confirm: ''
        };
        
        showToast("Password changed successfully", "success");
    } catch (error) {
        console.error("Error changing password:", error);
        if (error.code === 'auth/wrong-password') {
            showToast("Current password is incorrect", "error");
        } else {
            showToast("Error changing password", "error");
        }
    } finally {
        isChangingPassword.value = false;
    }
}

// Delete user account
async function deleteAccount() {
    if (!currentUser.value) return;

    try {
        // Show a secure password input modal instead of using prompt
        const password = await new Promise((resolve, reject) => {
            const modal = document.createElement('div');
            modal.innerHTML = `
                <div class='fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50'>
                    <div class='bg-gray-800 border border-gray-700 rounded-xl p-8 max-w-md w-full mx-4'>
                        <h3 class='text-2xl text-red-300 mb-4'>Confirm Account Deletion</h3>
                        <p class='text-gray-300 mb-6'>Please enter your password to confirm account deletion:</p>
                        <input type='password' id='passwordInput' class='w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-100 focus:border-violet-400 focus:ring focus:ring-violet-400/20 focus:outline-none mb-4' placeholder='Enter your password' />
                        <div class='flex justify-end gap-4'>
                            <button id='cancelButton' class='px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors'>Cancel</button>
                            <button id='confirmButton' class='px-4 py-2 rounded-lg bg-red-500/30 hover:bg-red-500/50 text-red-200 transition-colors'>Confirm</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            modal.querySelector('#cancelButton').addEventListener('click', () => {
                document.body.removeChild(modal);
                reject('User cancelled');
            });

            modal.querySelector('#confirmButton').addEventListener('click', () => {
                const passwordInput = modal.querySelector('#passwordInput').value;
                document.body.removeChild(modal);
                resolve(passwordInput);
            });
        });

        // Re-authenticate user
        const credential = EmailAuthProvider.credential(
            currentUser.value.email,
            password
        );
        await reauthenticateWithCredential(auth.currentUser, credential);

        // Delete user data from Firestore
        await deleteDoc(doc(db, "Users", currentUser.value.uid));

        // Delete created quizzes
        for (const quiz of createdQuizzes.value) {
            await deleteDoc(doc(db, "Quizzes", quiz.id));
        }

        // Delete user authentication
        await deleteUser(auth.currentUser);

        showToast("Account deleted successfully", "success");
        showDeleteConfirm.value = false;

        // Redirect to home page
        window.location.href = '/';
    } catch (error) {
        console.error("Error deleting account:", error);
        showToast("Error deleting account. You may need to re-login before deleting.", "error");
        showDeleteConfirm.value = false;
    }
}
</script>