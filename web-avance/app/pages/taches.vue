<script setup lang="ts">
/**
 * @file pages/tasks.vue
 * @description Page Smart orchestrant le SEO et les actions.
 */
definePageMeta({ title: 'TACHES', middleware: 'auth' });

const taskStore = useTaskStore();
const { addCategory, removeCategory, addTask, removeTask, toggleTask } = useTasks();

const isCatModalOpen = ref(false);
const isTaskModalOpen = ref(false);
const selectedCatId = ref<string | null>(null);

await useFetch<any[]>('/api/categories/list', {
  key: 'tasks-main-fetch',
  onResponse({ response }) {
    taskStore.categories = response._data || []; 
  }
});

async function handleCreateCat(nom: string) {
  await addCategory(nom);
  isCatModalOpen.value = false;
}

function openTaskModal(catId: string) {
  selectedCatId.value = catId;
  isTaskModalOpen.value = true;
}

async function handleCreateTask(values: { title: string, description: string }) {
  if (selectedCatId.value) {
    await addTask(selectedCatId.value, values.title, values.description);
    isTaskModalOpen.value = false;
    selectedCatId.value = null;
  }
}
</script>

<template>
  <TaskLayout 
    :is-cat-modal-open="isCatModalOpen" 
    :is-task-modal-open="isTaskModalOpen"
    @close-cat="isCatModalOpen = false"
    @close-task="isTaskModalOpen = false"
  >
    <template #header-action>
      <div @click="isCatModalOpen = true" class="cursor-pointer border border-white/10 rounded-2xl px-6 py-4 hover:bg-stone-900/60 transition-all group w-fit bg-stone-900/20 backdrop-blur-sm shadow-xl">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
             <img src="/Add_task_icone.png" alt="Add" class="w-5 h-5"/>
          </div>
          <p class="text-stone-400 group-hover:text-white font-black uppercase tracking-widest text-[10px]">Ajouter une catégorie</p>
        </div>
      </div>
    </template>

    <CategoryCard 
      v-for="cat in taskStore.categories" 
      :key="cat.id" 
      v-bind="cat"
      @delete-category="removeCategory"
      @add-task="openTaskModal"
      @toggle-task="toggleTask"
      @delete-task="removeTask"
    />

    <template #modal-category>
      <CategoryForm @submit="handleCreateCat" @cancel="isCatModalOpen = false" />
    </template>

    <template #modal-task>
      <TaskForm @submit="handleCreateTask" @cancel="isTaskModalOpen = false" />
    </template>
  </TaskLayout>
</template>