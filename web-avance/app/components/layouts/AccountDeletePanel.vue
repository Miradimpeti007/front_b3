<script setup lang="ts">
/**
 * @file components/organisms/AccountDeletePanel.vue
 * @description Organisme de confirmation de suppression de compte.
 */
defineEmits(['confirm', 'cancel']);
</script>

<template>
  <section class="bg-red-500/5 border border-red-500/20 p-10 md:p-12 rounded-[3.5rem] shadow-2xl backdrop-blur-xl text-center">
    <div class="mb-8">
      <div class="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-10 h-10 text-red-500 animate-pulse" />
      </div>
      <h2 class="text-xl font-black text-red-500 uppercase tracking-[0.3em] italic mb-4">Alerte de Désactivation</h2>
      <p class="text-red-900/60 text-[9px] font-black uppercase tracking-[0.2em] leading-relaxed max-w-md mx-auto">
        L'effacement du matricule est définitif. Votre progression, votre rang et vos archives financières seront perdus dans le vide spatial.
      </p>
    </div>
    
    <div class="flex flex-col md:flex-row gap-4 justify-center">
      <button @click="$emit('cancel')" class="px-10 py-5 bg-stone-800 text-white rounded-2xl font-black uppercase text-[9px] tracking-widest hover:bg-stone-700 transition-all">
        Annuler la procédure
      </button>
      <button @click="$emit('confirm')" class="px-10 py-5 bg-red-600 text-white rounded-2xl font-black uppercase text-[9px] tracking-widest hover:bg-red-500 shadow-xl shadow-red-600/40 transition-all">
        Confirmer l'effacement
      </button>
    </div>
  </section>
</template>