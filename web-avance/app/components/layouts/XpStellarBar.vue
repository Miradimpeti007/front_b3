<script setup lang="ts">
/**
 * @file components/molecules/XpStellarBar.vue
 * @description Barre d'XP Gaming avec thème doré et animation de flux.
 */
const props = defineProps<{ xp: number; nextLevelXp: number; level: number }>();
const percentage = computed(() => Math.min(Math.round((props.xp / props.nextLevelXp) * 100), 100));
</script>

<template>
  <div class="flex flex-col items-center w-full max-w-2xl mx-auto space-y-4">
    <div class="flex justify-between w-full px-2 items-end">
      <span class="text-amber-500 font-black text-xs uppercase tracking-[0.5em] italic">Grade : Rang {{ level }}</span>
      <span class="text-white font-black text-xl italic tracking-tighter">{{ xp }} / {{ nextLevelXp }} <span class="text-amber-500/50 text-xs">XP</span></span>
    </div>

    <div class="w-full h-4 bg-stone-950 rounded-full border border-amber-500/20 p-1 relative shadow-[0_0_20px_rgba(245,158,11,0.1)] overflow-hidden">
      <div 
        class="h-full bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(245,158,11,0.5)]"
        :style="{ width: percentage + '%' }"
      >
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
      </div>
    </div>
    
    <p class="text-[9px] font-black text-stone-600 uppercase tracking-[0.3em]">{{ percentage }}% de complétion vers le grade supérieur</p>
  </div>
</template>

<style scoped>
@keyframes shimmer { 100% { transform: translateX(100%); } }
</style>