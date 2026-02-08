/**
 * @file composables/useTasks.ts
 * @description Logique métier CRUD et synchronisation de la progression utilisateur.
 */
export const useTasks = () => {
  const taskStore = useTaskStore();
  const authStore = useAuthStore();

  /**
   * Synchronise l'état local avec le serveur.
   */
  async function fetchAll() {
    const data = await $fetch<any[]>('/api/categories/list');
    taskStore.categories = data || [];
  }

  async function addCategory(nom: string) {
    await $fetch('/api/categories/add', { method: 'POST', body: { nom } });
    await fetchAll();
  }

  async function removeCategory(id: string) {
    await $fetch('/api/categories/delete', { method: 'DELETE', body: { id } });
    taskStore.categories = taskStore.categories.filter(c => c.id !== id);
  }

  async function addTask(categoryId: string, title: string, description: string) {
    await $fetch('/api/tasks/add', { 
      method: 'POST', 
      body: { categoryId, title, description } 
    });
    await fetchAll();
  }

  async function removeTask(catId: string, taskId: string) {
    await $fetch('/api/tasks/delete', { method: 'DELETE', body: { catId, taskId } });
    await fetchAll();
  }

  async function toggleTask(catId: string, taskId: string) {
    const res = await $fetch<any>('/api/tasks/toggle', { method: 'PATCH', body: { catId, taskId } });
    
    if (res.progression && authStore.user) {
      authStore.user.level = res.progression.level;
      authStore.user.xp = res.progression.xp;
      authStore.user.nextLevelXp = res.progression.nextLevelXp;
    }
    await fetchAll();
  }

  return { addCategory, removeCategory, addTask, removeTask, toggleTask, fetchAll };
};