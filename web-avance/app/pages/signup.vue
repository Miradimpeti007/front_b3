<script setup lang="ts">
/**
 * @file pages/signup.vue
 * @description Page Smart orchestrant la création de compte et les redirections.
 */
definePageMeta({ layout: false });

const authStore = useAuthStore();
const toast = useToast();
const signupFormRef = ref();

/**
 * Récupération des avatars en SSR.
 */
const { data: avatars } = await useFetch<any[]>('/api/auth/avatars', {
  key: 'avatars-list'
});

/**
 * Traitement de la soumission du formulaire.
 */
async function onSignup(formValues: any) {
  try {
    /**
     * Appel à l'API via le store.
     */
    await authStore.signup(formValues);
    
    toast.add({ 
      title: 'Succès', 
      description: 'Votre compte a été créé. Connectez-vous maintenant.', 
      color: 'success' 
    });

    // Redirection vers le login après succès
    await navigateTo('/login');
  } catch (err: any) {
    const statusMessage = err.data?.statusMessage || 'Une erreur est survenue lors de l\'inscription';
    
    /**
     * Gestion du doublon d'utilisateur (Erreur 400).
     */
    if (err.statusCode === 400 && signupFormRef.value) {
      signupFormRef.value.setServerErrors('username', statusMessage);
    } else {
      toast.add({ 
        title: 'Erreur', 
        description: statusMessage, 
        color: 'error' 
      });
    }
  }
}
</script>

<template>
  <AuthLayout>
    <template #title>Inscription</template>
    <template #subtitle>Rejoignez l'aventure et commencez à gérer votre foyer.</template>
    
    <SignupForm 
      ref="signupFormRef"
      :avatars="avatars || []" 
      @submit="onSignup" 
    />

    <template #footer>
      <p class="text-stone-500 text-sm">
        Déjà membre ? 
        <NuxtLink to="/login" class="text-blue-500 font-black hover:underline ml-1">Connectez-vous</NuxtLink>
      </p>
    </template>
  </AuthLayout>
</template>