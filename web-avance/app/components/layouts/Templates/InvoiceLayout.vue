<script setup lang="ts">
/**
 * @file components/templates/InvoiceLayout.vue
 * @description Template Dumb gérant la structure spatiale.
 */
defineProps<{ isModalOpen: boolean }>();
defineEmits(['close-modal']);
</script>

<template>
  <div class="h-[calc(100vh-120px)] flex flex-col p-10">
    <header class="mb-12 flex-none flex items-center justify-between">
      <div class="flex items-center gap-6">
        <slot name="add-button" />
        <slot name="filter-select" />
      </div>
    </header>

    <div class="grid grid-cols-[50px_2fr_1fr_1fr_1fr_1fr_100px] px-8 mb-4 items-center flex-none">
      <span></span>
      <span class="text-[9px] font-black uppercase tracking-[0.3em] text-stone-600">Prestataire</span>
      <span class="text-[9px] font-black uppercase tracking-[0.3em] text-stone-600 text-center">Émission</span>
      <span class="text-[9px] font-black uppercase tracking-[0.3em] text-stone-600 text-center">Échéance</span>
      <span class="text-[9px] font-black uppercase tracking-[0.3em] text-stone-600 text-center">Montant</span>
      <span class="text-[9px] font-black uppercase tracking-[0.3em] text-stone-600 text-center">État</span>
      <span class="text-[9px] font-black uppercase tracking-[0.3em] text-stone-600 text-right">Actions</span>
    </div>

    <main class="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-4">
      <slot />
    </main>

    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div @click="$emit('close-modal')" class="absolute inset-0 bg-black/80 backdrop-blur-md"></div>
        <div class="relative bg-zinc-900 border border-white/10 w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl">
          <slot name="modal-content" />
        </div>
      </div>
    </Teleport>
  </div>
</template>