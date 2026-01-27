<template>
  <div class="flex flex-col w-80 h-fit max-h-[600px] bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden shadow-lg">
    
    <header class="p-5 border-b border-white/5 bg-white/[0.02] flex justify-between items-center group/header text-ellipsis">
      <h3 class="font-black text-stone-200 truncate pr-2 uppercase">{{ title }}</h3>
      <div class="flex items-center gap-2">
        <span class="text-[10px] text-stone-500 font-bold">{{ tasks.length }}</span>
        <button @click="$emit('delete-category', id)" class="opacity-0 group-hover/header:opacity-100 p-1.5 hover:bg-red-500/10 rounded-lg transition-all">
          <svg class="w-4 h-4 text-red-500/50 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </header>

    <button @click="$emit('add-task')" class="flex items-center justify-center gap-2 p-3 m-4 border border-dashed border-white/10 rounded-xl hover:bg-blue-600/10 hover:border-blue-500/50 transition-all group">
      <span class="text-xs text-stone-500 group-hover:text-blue-400 font-bold uppercase tracking-widest">Nouvelle tâche</span>
    </button>

    <div class="flex-1 overflow-y-auto px-4 pb-6 space-y-3 custom-scrollbar">
      <TaskItem 
        v-for="task in tasks" 
        :key="task.id"
        :data="task"
        @toggle-status="$emit('toggle-task', id, task.id)"
        @delete-task="$emit('delete-task', id, task.id)"
      />
      <div v-if="tasks.length === 0" class="py-10 text-center opacity-20 italic text-xs text-white">
        Aucune tâche
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  id: number,
  title: string,
  tasks: any[]
}>()

defineEmits(['add-task', 'delete-category', 'toggle-task', 'delete-task'])
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
</style>