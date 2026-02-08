<template>
  <div class="min-h-screen bg-stone-950 p-10 flex flex-col gap-14">
    <header @click="isCatModalOpen = true" class="cursor-pointer border border-white/10 rounded-2xl px-6 py-4 hover:bg-stone-900/60 transition-all group w-fit bg-stone-900/20 backdrop-blur-sm shadow-xl">
      <div class="flex items-center gap-4">
        <div class="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
           <img src="/Add_task_icone.png" alt="Add" class="w-5 h-5"/>
        </div>
        <p class="text-stone-400 group-hover:text-white font-black uppercase tracking-widest text-[10px]">Ajouter une catégorie</p>
      </div>
    </header>

    <main class="flex gap-10 overflow-x-auto pb-20 items-start custom-scrollbar">
      <div v-for="cat in taskStore.categories" :key="cat.id" 
           class="bg-stone-900/20 border border-white/5 rounded-[2.5rem] p-8 min-w-[340px] flex flex-col gap-8">
        
        <div class="flex justify-between items-center px-2">
          <h3 class="text-xl font-black uppercase tracking-tighter italic text-white">{{ cat.nom }}</h3>
          <button @click="removeCategory(cat.id)" class="text-stone-600 hover:text-red-500">
            <UIcon name="i-heroicons-trash" class="w-5 h-5" />
          </button>
        </div>

        <div class="flex flex-col gap-4">
          <TaskItem 
            v-for="task in cat.tasks" 
            :key="task.id"
            :id="task.id"
            :title="task.title"
            :is-done="task.isDone"
            @toggle="(taskId) => toggleTask(cat.id, taskId)"
            @delete="(taskId) => removeTask(cat.id, taskId)"
          />
        </div>

        <button @click="openTaskModal(cat.id)" class="w-full py-4 border-2 border-dashed border-stone-800 rounded-2xl text-stone-600 font-black text-[10px] uppercase tracking-widest hover:border-blue-600">
          + Ajouter une tâche
        </button>
      </div>
    </main>

    <Teleport to="body">
      <div v-if="isCatModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
        <div class="bg-zinc-900 border border-white/10 w-full max-w-md rounded-[3rem] p-10 shadow-2xl">
          <CategoryForm @submit="handleCreateCat" @cancel="isCatModalOpen = false" />
        </div>
      </div>

      <div v-if="isTaskModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
        <div class="bg-zinc-900 border border-white/10 w-full max-w-lg rounded-[3rem] p-10 shadow-2xl">
          <TaskForm @submit="handleCreateTask" @cancel="isTaskModalOpen = false" />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
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
  }
}
</script>