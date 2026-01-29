<template>
  <NuxtLink 
    :to="to" 
    class="flex items-center gap-5 px-7 py-4 rounded-2xl transition-all duration-300 border border-transparent group"
    active-class="bg-stone-800 border-white/5 shadow-xl text-white"
    inactive-class="text-stone-500 hover:bg-stone-800/40 hover:text-stone-300"
  >
    <span class="text-[11px] uppercase font-black tracking-[0.25em]">
      {{ label }}
    </span>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  to: string;
  label: string;
  icon?: string;
}>();
</script>