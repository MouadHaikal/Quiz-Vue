<template>
  <div class="min-h-screen flex items-center justify-center shadow-md outline outline-black/5 dark:bg-gray-800 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm space-y-4">
          <!-- Username Input -->
          <div class="relative">
            <label for="username" class="sr-only">Username</label>
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 stroke-pink-700 dark:stroke-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input
              id="username"
              name="username"
              type="text"
              required
              class="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Username"
              v-model="username"
            />
          </div>

          <!-- Email Input -->
          <div class="relative">
            <label for="email" class="sr-only">Email address</label>
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 stroke-pink-700 dark:stroke-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Email address"
              v-model="email"
            />
          </div>

          <!-- Password Input -->
          <div class="relative">
            <label for="password" class="sr-only">Password</label>
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 stroke-pink-700 dark:stroke-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              id="password"
              name="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="new-password"
              required
              minlength="6"
              class="appearance-none rounded-md relative block w-full pl-10 pr-10 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Password (min 6 characters)"
              v-model="password"
            />
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center z-10">
              <button
                type="button"
                class="text-gray-400 hover:text-gray-500 focus:outline-none"
                @click="togglePasswordVisibility"
              >
                <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 stroke-pink-700 dark:stroke-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 stroke-pink-700 dark:stroke-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Confirm Password Input -->
          <div class="relative">
            <label for="confirmPassword" class="sr-only">Confirm Password</label>
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 stroke-pink-700 dark:stroke-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              autocomplete="new-password"
              required
              minlength="6"
              class="appearance-none rounded-md relative block w-full pl-10 pr-10 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Confirm Password"
              v-model="confirmPassword"
            />
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center z-10">
              <button
                type="button"
                class="text-gray-400 hover:text-gray-500 focus:outline-none"
                @click="toggleConfirmPasswordVisibility"
              >
                <svg v-if="showConfirmPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 stroke-pink-700 dark:stroke-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 stroke-pink-700 dark:stroke-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div class="mt-6">
            <button
              @click="handleGoogleSignIn"
              type="button"
              class="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              :disabled="isLoading"
            >
              <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="#EA4335"/>
                <path d="M23.26 12.153c0-.84-.08-1.613-.213-2.347H12.48v4.64h6.24c-.267 1.44-1.107 2.56-2.347 3.173v2.907h3.787c2.213-2.053 3.493-5.08 3.493-8.373z" fill="#4285F4"/>
                <path d="M7.68 14.92c-.267-.8-.4-1.653-.4-2.52s.133-1.72.4-2.52V7.067H3.787C2.92 8.787 2.4 10.813 2.4 12.4c0 1.587.52 3.613 1.387 5.333l2.907-2.907z" fill="#FBBC05"/>
                <path d="M12.48 24c3.573 0 6.56-1.173 8.76-3.173l-3.787-2.907c-1.027.693-2.347 1.04-4.973 1.04-3.627 0-6.693-2.44-7.787-5.933H.853v2.987C3.053 21.387 7.373 24 12.48 24z" fill="#34A853"/>
              </svg>
              Sign up with Google
            </button>
          </div>
        </div>

        <div v-if="error" class="text-red-500 text-sm text-center py-2">
          {{ error }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </span>
            <span v-else>Sign up</span>
          </button>
        </div>
      </form>


      <div class="text-sm text-right">

        <router-link to="/login" class="font-medium text-indigo-600 hover:text-indigo-500">Login</router-link>
      </div>
    </div>

  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref } from 'vue';
import { registerUser,signInWithGoogle } from "../composables/useAuth.js";

const router = useRouter();

// Form state
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const error = ref('');
const isLoading = ref(false);
const isLoadingGoogle = ref(false)

// Toggle password visibility
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

// Form submission handler
async function handleSubmit() {
  error.value = '';
  isLoading.value = true;

  // Validate form inputs
  if (!username.value || !email.value || !password.value || !confirmPassword.value) {
    error.value = "Please fill in all fields";
    isLoading.value = false;
    return;
  }

  if (password.value.length < 6) {
    error.value = "Password must be at least 6 characters";
    isLoading.value = false;
    return;
  }

  if (password.value !== confirmPassword.value) {
    error.value = "Passwords do not match";
    isLoading.value = false;
    return;
  }

  try {
    await registerUser({
      email: email.value,
      password: password.value,
      username: username.value
    });

    // Redirect on successful registration
    router.push('/');
  } catch (err) {
    console.error("Registration error:", err);
    error.value = err.message || "Registration failed. Please try again.";
  } finally {
    isLoading.value = false;
  }
}


async function handleGoogleSignIn() {
  error.value = '';
  isLoadingGoogle.value = true;

  try {
    const { user, error: googleError } = await signInWithGoogle();

    if (googleError) {
      throw new Error(googleError.message || "Authentification failed usinig Google");
    }

    if (user) {
      // Navigate to appropriate page after successful Google sign-in
      router.push('/'); // or wherever you want users to go after login
    }
  } catch (err) {
    error.value = err.message;
  } finally {
    isLoadingGoogle.value = false;
  }
}





</script>

<style scoped>
/* Ensure icons are always visible */
.relative:focus-within svg {
  opacity: 1 !important;
}

/* Animation for loading spinner */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
