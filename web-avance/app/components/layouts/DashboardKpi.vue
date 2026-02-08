<script setup lang="ts">
/**
 * @file components/molecules/DashboardKpi.vue
 * @description Atome de donnée financier stylisé "Stellar".
 */
defineProps<{
  label: string;
  value: string | number;
  footer?: string;
  variant?: 'default' | 'success' | 'danger' | 'info';
}>();

const variants = {
  default: 'bg-stone-900/40 border-white/5 text-white',
  success: 'bg-stone-900/40 border-white/5 text-green-500',
  danger: 'bg-red-500/5 border-red-500/20 text-red-500',
  info: 'bg-blue-500/5 border-blue-500/20 text-white'
};
</script>

<template>
  <div class="p-6 rounded-[2rem] border backdrop-blur-sm shadow-xl transition-all hover:border-white/10" :class="variants[variant || 'default']">
    <p class="text-stone-500 text-[9px] font-black uppercase tracking-widest mb-1">{{ label }}</p>
    <h3 class="text-2xl font-black tracking-tighter italic">{{ value }}</h3>
    <p v-if="footer" class="text-stone-600 text-[8px] font-bold uppercase mt-2 truncate">{{ footer }}</p>
  </div>
</template>