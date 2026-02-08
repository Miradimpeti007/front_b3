import { defineStore } from 'pinia';

/**
 * @file stores/taskStore.ts
 * @description Magasin d'état centralisé pour la gestion des catégories et des tâches.
 */
export const useTaskStore = defineStore('taskStore', () => {
  const categories = ref<any[]>([]);

  return { categories };
});