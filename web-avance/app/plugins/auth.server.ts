// Fichier : app/plugins/auth.server.ts
export default defineNuxtPlugin(async (nuxtApp) => {
  const authStore = useAuthStore();

  // Pas besoin de 'if (import.meta.server)' ici !
  // Nuxt sait déjà qu'il est sur le serveur grâce au nom du fichier.
  try {
    await authStore.initAuth();
  } catch (error) {
    // Session inexistante
  }
});