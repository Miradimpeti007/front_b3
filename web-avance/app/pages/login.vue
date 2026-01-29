<template>
  <div class="min-h-screen bg-black flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-zinc-900 border border-white/5 rounded-3xl p-8 shadow-2xl">
      <header class="text-center mb-10">
        <h1 class="text-3xl font-black text-white uppercase tracking-tighter">Connexion</h1>
        <p class="text-stone-500 font-medium mt-2">Heureux de vous revoir</p>
      </header>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div class="space-y-2">
          <label class="text-xs font-black text-stone-400 uppercase ml-1">Pseudo</label>
          <input 
            v-model="credentials.username" 
            type="text" 
            required 
            placeholder="Votre pseudo" 
            class="w-full bg-stone-800 border border-stone-700 text-white rounded-xl p-4 outline-none focus:border-blue-500 transition-all" 
          />
        </div>

        <div class="space-y-2">
          <label class="text-xs font-black text-stone-400 uppercase ml-1">Mot de passe</label>
          <input 
            v-model="credentials.password" 
            type="password" 
            required 
            placeholder="••••••••" 
            class="w-full bg-stone-800 border border-stone-700 text-white rounded-xl p-4 outline-none focus:border-blue-500 transition-all" 
          />
        </div>

        <div class="pt-4">
          <button 
            type="submit" 
            :disabled="loading"
            class="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-stone-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20"
          >
            {{ loading ? 'Identification...' : 'Se connecter' }}
          </button>
          
          <p class="text-center text-stone-500 text-sm mt-8">
            Pas encore de compte ? 
            <NuxtLink to="/signup" class="text-blue-400 font-bold hover:underline">Créer un compte</NuxtLink>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Login page component
 * Orchestrates user authentication via the centralized AuthStore
 */
definePageMeta({
  layout: false
});

const authStore = useAuthStore();
const toast = useToast();
const loading = ref(false);

const credentials = ref({
  username: '',
  password: ''
});

/**
 * Executes login flow
 * On success, the store handles state population and redirection
 */
async function handleLogin() {
  loading.value = true;
  try {
    await authStore.login(credentials.value);
    
    toast.add({
      title: 'Connexion réussie',
      description: `Ravi de vous revoir, ${authStore.user?.username} !`,
      color: 'success'
    });
  } catch (err: any) {
    toast.add({
      title: 'Erreur d\'identification',
      description: err.data?.statusMessage || 'Identifiants incorrects',
      color: 'error'
    });
  } finally {
    loading.value = false;
  }
}
</script>