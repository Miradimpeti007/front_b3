<template>
  <div 
    @click="$emit('toggle-status')"
    class="group/item flex flex-col w-full min-h-[100px] bg-stone-800/40 border border-white/[0.03] rounded-2xl p-4 hover:border-blue-500/30 transition-all cursor-pointer relative overflow-hidden"
    :class="{ 'opacity-50 select-none': data.isDone }"
  >
    <div class="flex items-start gap-3">
      <div 
        class="w-5 h-5 rounded-md border border-white/10 flex-shrink-0 flex items-center justify-center transition-all"
        :class="data.isDone ? 'bg-blue-600 border-blue-600' : 'bg-transparent'"
      >
        <svg v-if="data.isDone" class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <div class="flex-1 truncate">
        <div class="flex justify-between items-start">
          <h4 class="font-bold text-stone-200 text-sm truncate uppercase tracking-tight" :class="{ 'line-through text-stone-500': data.isDone }">
            {{ data.title }}
          </h4>
          
          <button 
            @click.stop="$emit('delete-task', data.id)"
            class="opacity-0 group-hover/item:opacity-100 p-1 hover:bg-red-500/10 rounded transition-all"
          >
            <svg class="w-3.5 h-3.5 text-red-500/50 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
        
        <div class="mt-2 h-12 overflow-y-auto custom-scrollbar">
          <p class="text-[11px] text-stone-500 leading-relaxed pr-1" :class="{ 'line-through opacity-30': data.isDone }">
            {{ data.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  data: { id: number; title: string; description: string; isDone: boolean; }
}>()

defineEmits(['toggle-status', 'delete-task'])
</script>