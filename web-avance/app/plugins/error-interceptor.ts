/**
 * @file plugins/error-interceptor.ts
 * @description Le "Gardien Invisible" qui surveille toutes les routes de ton projet.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const authStore = useAuthStore();

  // On injecte la logique directement dans le moteur de fetch de Nuxt
  nuxtApp.hook('app:created', () => {
    // Cette configuration s'appliquera à TOUS les appels API du projet automatiquement
    globalThis.$fetch = $fetch.create({
      async onResponseError({ response }) {
        if (response.status === 401) {
          console.warn("[Système] Session expirée détectée globalement.");
          
          try {
            // Tente le refresh automatique en arrière-plan
            const res = await $fetch<any>('/api/auth/refresh', { method: 'POST' });
            
            if (res.success) {
              authStore.user = res.user; // On répare le store
              return; // La page ne verra même pas l'erreur !
            }
          } catch (err) {
            // Si même le refresh échoue : Nettoyage et Téléportation
            authStore.user = null;
            await navigateTo('/login');
          }
        }
      }
    });
  });
});