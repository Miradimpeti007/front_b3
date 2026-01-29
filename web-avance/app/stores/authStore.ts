import { defineStore } from 'pinia';

/**
 * @file app/stores/auth.ts
 * @description Gestion de l'état d'authentification, rafraîchissement des jetons et administration du profil.
 */

const getTimeUntilExpiration = (token: string): number => {
  try {
    const [, base64Url] = token.split('.');
    if (!base64Url) return 14 * 60 * 1000;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const rawPayload = import.meta.server 
      ? Buffer.from(base64, 'base64').toString()
      : window.atob(base64);
    const jsonPayload = JSON.parse(rawPayload);
    if (!jsonPayload.exp) return 14 * 60 * 1000;
    return (jsonPayload.exp * 1000) - Date.now() - 60000;
  } catch (e) {
    return 14 * 60 * 1000;
  }
};

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();
  const user = ref<any>(null);
  const refreshTimer = ref<any>(null);
  const isAuthenticated = computed(() => !!user.value);

  function clearRefreshTimer() {
    if (refreshTimer.value) clearTimeout(refreshTimer.value);
  }

  function scheduleRefresh(token?: string) {
    if (import.meta.server) return;
    clearRefreshTimer();
    const ms = token ? getTimeUntilExpiration(token) : 14 * 60 * 1000;
    refreshTimer.value = setTimeout(() => refresh(), Math.max(ms, 1000));
  }

  async function refresh() {
    try {
      const data = await $fetch<any>('/api/auth/refresh', { method: 'POST' });
      if (data?.user) {
        user.value = data.user;
        scheduleRefresh(data.token);
        return true;
      }
      return false;
    } catch {
      user.value = null;
      return false;
    }
  }

  async function initAuth() {
    if (user.value) return;
    try {
      const headers = useRequestHeaders(['cookie']) as HeadersInit;
      const data = await $fetch<any>('/api/auth/me', { headers });
      if (data?.user) {
        user.value = data.user;
        scheduleRefresh(data.token);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        await refresh();
      } else {
        user.value = null;
      }
    }
  }

  async function login(credentials: any) {
    const data = await $fetch<any>('/api/auth/login', { method: 'POST', body: credentials });
    if (data.user) {
      user.value = data.user;
      scheduleRefresh(data.token);
      await router.push('/');
    }
  }

  async function logout() {
    clearRefreshTimer();
    await $fetch('/api/auth/logout', { method: 'POST' });
    user.value = null;
    await router.push('/login');
  }

  /**
   * Met à jour les informations du profil utilisateur en base de données.
   * @param body Champs à modifier (username, avatar, householdCount, etc.)
   */
  async function updateProfile(body: any) {
    try {
      const data = await $fetch<any>('/api/user/update', { 
        method: 'PATCH', 
        body 
      });
      if (data.success && data.user) {
        user.value = data.user; // Mise à jour réactive immédiate
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error('Update Profile Error:', error);
      throw error;
    }
  }

  /**
   * Supprime définitivement le compte utilisateur et déconnecte la session.
   */
  async function deleteAccount() {
    try {
      const data = await $fetch<any>('/api/user/delete', { method: 'DELETE' });
      if (data.success) {
        await logout(); // Nettoyage local et redirection
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error('Delete Account Error:', error);
      throw error;
    }
  }

  return { 
    user, 
    isAuthenticated, 
    initAuth, 
    login, 
    logout, 
    refresh, 
    updateProfile, 
    deleteAccount 
  };
});