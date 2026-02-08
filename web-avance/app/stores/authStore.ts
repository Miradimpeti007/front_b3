import { defineStore } from 'pinia';

/**
 * @file stores/auth.ts
 * @description Gestion centralisée de l'identité utilisateur et du cycle de vie des jetons.
 */
export const useAuthStore = defineStore('auth', () => {
  const user = ref<any>(null);
  const isAuthenticated = computed(() => !!user.value);
  const router = useRouter();

  /**
   * Initialisation de la session au démarrage (SSR/Client).
   */
  async function initAuth() {
    try {
      const headers = useRequestHeaders(['cookie']) as HeadersInit;
      const data = await $fetch<any>('/api/auth/me', { headers });
      if (data?.user) user.value = data.user;
    } catch {
      user.value = null;
    }
  }

  /**
   * Identification et redirection.
   */
  async function login(credentials: any) {
    const data = await $fetch<any>('/api/auth/login', { 
      method: 'POST', 
      body: credentials 
    });
    if (data.user) {
      user.value = data.user;
      await router.push('/');
    }
  }

  /**
   * Inscription d'un nouveau profil.
   */
  async function signup(form: any) {
    await $fetch('/api/auth/signup', { 
      method: 'POST', 
      body: form 
    });
    await router.push('/login');
  }

  /**
   * Révocation de session et nettoyage local.
   */
  async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' });
    user.value = null;
    await router.push('/login');
  }

  return { user, isAuthenticated, initAuth, login, signup, logout };
});