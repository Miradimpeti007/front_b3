import { defineStore } from 'pinia'

export const useTaskStore = defineStore('taskStore', () => {
  const categories = ref<any[]>([])
  const user = ref<any>(null)
  const currentUserId = ref(1) // ID statique avant le futur login

  // Rafraîchir les données du store
  async function refresh() {
    const data = await $fetch<any>('/api/db')
    categories.value = data.categories.filter((c: any) => c.userId === currentUserId.value)
    user.value = data.users.find((u: any) => u.id === currentUserId.value)
  }

  // --- ACTIONS ---
  async function addCategory(nom: string) {
    await $fetch('/api/categories/add', { 
      method: 'POST', 
      body: { nom, userId: currentUserId.value } 
    })
    await refresh()
  }

  async function removeCategory(id: string) {
    await $fetch('/api/categories/delete', { method: 'DELETE', body: { id } })
    await refresh()
  }

  async function addTask(categoryId: string, title: string, description: string) {
    await $fetch('/api/tasks/add', { 
      method: 'POST', 
      body: { categoryId, title, description } 
    })
    await refresh()
  }

  async function removeTask(catId: string, taskId: string) {
    await $fetch('/api/tasks/delete', { method: 'DELETE', body: { catId, taskId } })
    await refresh()
  }

  async function toggleTaskStatus(catId: string, taskId: string) {
    await $fetch('/api/tasks/toggle', { method: 'PATCH', body: { catId, taskId } })
    await refresh()
  }

  return { 
    categories, user, refresh, 
    addCategory, removeCategory, 
    addTask, removeTask, toggleTaskStatus 
  }
})