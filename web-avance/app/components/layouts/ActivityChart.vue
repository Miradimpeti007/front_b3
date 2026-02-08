<script setup lang="ts">
/**
 * @file components/organisms/ActivityChart.vue
 * @description Visualisation des flux.
 */
defineProps<{ data: any[], max: number }>();
</script>

<template>
  <section class="bg-stone-900/40 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
    <div class="flex justify-between items-center mb-10 px-2">
      <h2 class="text-[10px] font-black text-white uppercase tracking-[0.4em]">Flux d'activité</h2>
      <span class="px-3 py-1 bg-stone-800 text-stone-500 text-[8px] font-black rounded-full border border-white/5 uppercase">7 derniers jours</span>
    </div>
    
    <div class="h-48 w-full flex items-end justify-between gap-3 px-4">
      <div v-for="(day, i) in data" :key="i" class="flex-1 flex flex-col items-center gap-3 group h-full justify-end">
        <div class="w-full bg-blue-600/20 group-hover:bg-blue-500 rounded-t-xl transition-all relative" :style="{ height: (day.montant / max * 100) + '%' }">
          <div class="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 text-[8px] font-black text-white bg-stone-800 px-2 py-1 rounded border border-white/10 whitespace-nowrap">{{ day.montant }}€</div>
        </div>
        <span class="text-[8px] font-black text-stone-600 uppercase">{{ day.label }}</span>
      </div>
    </div>
  </section>
</template>