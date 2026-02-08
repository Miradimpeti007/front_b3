<script setup lang="ts">
/**
 * @file components/molecules/TaskItem.vue
 * @description Représentation visuelle d'une tâche.
 */
defineProps<{ id: string; title: string; isDone: boolean; }>();
defineEmits(['toggle', 'delete']);
</script>

<template>
  <div class="group flex items-center justify-between p-4 bg-stone-800/40 border border-white/5 rounded-2xl hover:bg-stone-800/60 transition-all">
    <div class="flex items-center gap-4 cursor-pointer flex-1" @click="$emit('toggle', id)">
      <div class="w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all"
           :class="isDone ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-600/30' : 'border-stone-700 bg-stone-900'">
        <UIcon v-if="isDone" name="i-heroicons-check-bold" class="text-white w-3 h-3" />
      </div>
      <span class="text-sm font-black uppercase tracking-tight text-white" :class="{'line-through opacity-30 text-stone-500': isDone}">
        {{ title }}
      </span>
    </div>
    <button @click="$emit('delete', id)" class="opacity-0 group-hover:opacity-100 text-stone-600 hover:text-red-500 transition-all px-2">
      <UIcon name="i-heroicons-trash" class="w-4 h-4" />
    </button>
  </div>
</template>