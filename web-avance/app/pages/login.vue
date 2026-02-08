<script setup lang="ts">
/**
 * @file pages/login.vue
 * @description Contrôleur de la page de connexion gérant les retours d'API.
 */
definePageMeta({ layout: false });

const authStore = useAuthStore();
const loginFormRef = ref(); // Référence vers l'organisme

async function onLogin(credentials: any) {
  try {
    await authStore.login(credentials);
  } catch (err: any) {
    // Récupération du message d'erreur du serveur (ex: 401 Unauthorized)
    const statusMessage = err.data?.statusMessage || 'Identifiants invalides';
    
    // Injection de l'erreur dans l'organisme via setErrors
    if (loginFormRef.value) {
      loginFormRef.value.setServerErrors(statusMessage);
    }
  }
}
</script>

<template>
  <AuthLayout>
    <template #title>Connexion</template>
    <template #subtitle>Entrez vos identifiants pour accéder à votre foyer.</template>
    
    <LoginForm 
      ref="loginFormRef" 
      @submit="onLogin" 
    />

    <template #footer>
      <p class="text-stone-500 text-sm">
        Pas encore membre ? 
        <NuxtLink to="/signup" class="text-blue-500 font-black hover:underline ml-1">Inscrivez-vous</NuxtLink>
      </p>
    </template>
  </AuthLayout>
</template>