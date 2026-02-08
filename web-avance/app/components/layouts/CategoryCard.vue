<script setup lang="ts">
/**
 * @file components/organisms/CategoryCard.vue
 * @description Conteneur de catégorie gérant la liste des molécules TaskItem.
 */
defineProps<{
  id: string;
  nom: string;
  tasks: any[];
}>();

defineEmits(['delete-category', 'add-task', 'toggle-task', 'delete-task']);
</script>

<template>
  <div class="bg-stone-900 border border-white/5 rounded-[2.5rem] p-8 min-w-[340px] flex flex-col gap-8">
    <div class="flex justify-between items-center px-2">
      <h3 class="text-xl font-black uppercase tracking-tighter italic text-white">{{ nom }}</h3>
      <button @click="$emit('delete-category', id)" class="text-stone-600 hover:text-red-500 transition-colors">
        <UIcon name="i-heroicons-trash" class="w-5 h-5" />
      </button>
    </div>

    <div class="flex flex-col gap-4">
      <TaskItem 
        v-for="task in tasks" :key="task.id"
        v-bind="task"
        @toggle="(taskId) => $emit('toggle-task', id, taskId)"
        @delete="(taskId) => $emit('delete-task', id, taskId)"
      />
    </div>

    <button @click="$emit('add-task', id)" class="w-full py-4 border-2 border-dashed border-stone-800 rounded-2xl text-stone-600 font-black text-[10px] uppercase tracking-widest hover:border-blue-600 transition-all">
      + Ajouter une tâche
    </button>
  </div>
</template>