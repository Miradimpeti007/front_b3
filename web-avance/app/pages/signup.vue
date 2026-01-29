<template>
  <div class="min-h-screen bg-black flex items-center justify-center p-4">
    <div class="w-full max-w-2xl bg-zinc-900 border border-white/5 rounded-3xl p-8 shadow-2xl">
      <header class="text-center mb-10">
        <h1 class="text-3xl font-black text-white uppercase tracking-tighter">Créer un compte</h1>
        <p class="text-stone-500 font-medium mt-2">Rejoignez l'aventure et gérez votre foyer</p>
      </header>

      <form @submit.prevent="handleSignup" class="space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-xs font-black text-stone-400 uppercase ml-1">Prénom</label>
            <input v-model="form.firstName" type="text" required placeholder="Ex: Jean" class="w-full bg-stone-800 border border-stone-700 text-white rounded-xl p-4 outline-none focus:border-blue-500 transition-all" />
          </div>
          <div class="space-y-2">
            <label class="text-xs font-black text-stone-400 uppercase ml-1">Nom de famille</label>
            <input v-model="form.lastName" type="text" required placeholder="Ex: Dupont" class="w-full bg-stone-800 border border-stone-700 text-white rounded-xl p-4 outline-none focus:border-blue-500 transition-all" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-xs font-black text-stone-400 uppercase ml-1">Pseudo</label>
            <input v-model="form.username" type="text" required placeholder="Pseudo unique" class="w-full bg-stone-800 border border-stone-700 text-white rounded-xl p-4 outline-none focus:border-blue-500 transition-all" />
          </div>
          <div class="space-y-2">
            <label class="text-xs font-black text-stone-400 uppercase ml-1">Mot de passe</label>
            <input v-model="form.password" type="password" required placeholder="••••••••" class="w-full bg-stone-800 border border-stone-700 text-white rounded-xl p-4 outline-none focus:border-blue-500 transition-all" />
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-xs font-black text-stone-400 uppercase ml-1">Nombre de personnes dans le foyer</label>
          <div class="flex items-center gap-4 bg-stone-800 border border-stone-700 rounded-xl p-2">
            <button type="button" @click="form.householdSize = Math.max(1, form.householdSize - 1)" class="w-10 h-10 flex items-center justify-center bg-stone-700 rounded-lg text-white font-bold">-</button>
            <span class="flex-1 text-center font-black text-white">{{ form.householdSize }}</span>
            <button type="button" @click="form.householdSize++" class="w-10 h-10 flex items-center justify-center bg-stone-700 rounded-lg text-white font-bold">+</button>
          </div>
        </div>

        <div class="space-y-4">
          <label class="text-xs font-black text-stone-400 uppercase ml-1">Choisir un avatar</label>
          <div class="grid grid-cols-3 md:grid-cols-6 gap-4">
            <button 
              v-for="avatar in avatars" 
              :key="avatar.id"
              type="button"
              @click="form.avatar = avatar.url"
              class="relative aspect-square rounded-2xl overflow-hidden border-4 transition-all"
              :class="form.avatar === avatar.url ? 'border-blue-500 scale-105' : 'border-transparent opacity-50 hover:opacity-100'"
            >
              <img :src="avatar.url" class="w-full h-full object-cover" />
              <div v-if="form.avatar === avatar.url" class="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                <UIcon name="i-heroicons-check-circle-20-solid" class="text-white w-6 h-6" />
              </div>
            </button>
          </div>
        </div>

        <div class="pt-6">
          <button 
            type="submit" 
            :disabled="loading"
            class="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-stone-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20"
          >
            {{ loading ? 'Création en cours...' : 'Finaliser l\'inscription' }}
          </button>
          <p class="text-center text-stone-500 text-sm mt-6">
            Déjà membre ? 
            <NuxtLink to="/login" class="text-blue-400 font-bold hover:underline">Se connecter</NuxtLink>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Signup page logic
 * Manages user profile creation including avatar selection and household data
 */
definePageMeta({
  layout: false
});

const toast = useToast();
const loading = ref(false);

const form = ref({
  username: '',
  password: '',
  firstName: '',
  lastName: '',
  householdSize: 1,
  avatar: ''
});

// Fetching available avatars from the API
const { data: avatars } = await useFetch<any[]>('/api/auth/avatars');

/**
 * Submits the registration form to the backend
 * On success, redirects to the login page with a notification
 */
async function handleSignup() {
  if (!form.value.avatar) {
    toast.add({ title: 'Erreur', description: 'Veuillez choisir un avatar', color: 'error' });
    return;
  }

  loading.value = true;
  try {
    await $fetch('/api/auth/signup', {
      method: 'POST',
      body: form.value
    });

    toast.add({
      title: 'Compte créé !',
      description: 'Vous pouvez maintenant vous connecter.',
      color: 'success'
    });

    await navigateTo('/login');
  } catch (err: any) {
    toast.add({
      title: 'Erreur',
      description: err.data?.statusMessage || 'Une erreur est survenue',
      color: 'error'
    });
  } finally {
    loading.value = false;
  }
}
</script>