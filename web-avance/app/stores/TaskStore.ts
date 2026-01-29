import { defineStore } from 'pinia';
import { useAuthStore } from './authStore';

/**
 * Task and Category Management Store
 * Orchestrates data flow between the UI and the secure API layer
 */
export const useTaskStore = defineStore('taskStore', () => {
  const authStore = useAuthStore();
  const categories = ref<any[]>([]);

  /**
   * Data synchronization with server-side persistence
   * Triggered on mount and after every destructive or creative action
   */
  async function refresh() {
    if (!authStore.user) return;

    try {
      const data = await $fetch<any[]>('/api/categories/list');
      categories.value = data;
    } catch (error) {
      categories.value = [];
    }
  }

  /**
   * CATEGORY ACTIONS
   */
  async function addCategory(nom: string) {
    await $fetch('/api/categories/add', { 
      method: 'POST', 
      body: { nom } 
    });
    await refresh();
  }

  async function removeCategory(id: string) {
    await $fetch('/api/categories/delete', { 
      method: 'DELETE', 
      body: { id } 
    });
    await refresh();
  }

  /**
   * TASK ACTIONS
   */
  async function addTask(categoryId: string, title: string, description: string) {
    await $fetch('/api/tasks/add', { 
      method: 'POST', 
      body: { categoryId, title, description } 
    });
    await refresh();
  }

  async function removeTask(catId: string, taskId: string) {
    await $fetch('/api/tasks/delete', { 
      method: 'DELETE', 
      body: { catId, taskId } 
    });
    await refresh();
  }

  /**
   * TASK COMPLETION & PROGRESSION
   * Updates task state and synchronizes user XP/Level in AuthStore
   */
  async function toggleTaskStatus(catId: string, taskId: string) {
    const response = await $fetch<any>('/api/tasks/toggle', { 
      method: 'PATCH', 
      body: { catId, taskId } 
    });

    if (response.progression && authStore.user) {
      authStore.user.level = response.progression.level;
      authStore.user.xp = response.progression.xp;
      authStore.user.nextLevelXp = response.progression.nextLevelXp;
    }
    
    await refresh();
  }

  return { 
    categories, 
    refresh, 
    addCategory, 
    removeCategory, 
    addTask, 
    removeTask, 
    toggleTaskStatus 
  };
});