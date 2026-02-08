<script setup lang="ts">
/**
 * @file pages/factures.vue
 * @description Version stable : initialisation manuelle, bouton Add et Filtres inclus.
 */
definePageMeta({ title: 'FACTURES', middleware: 'auth' });

const store = useInvoiceStore();
const { sortKey, statusFilter, sortedInvoices, add, update, remove, pay } = useInvoices();

const isModalOpen = ref(false);
const isEditing = ref(false);
const currentInv = ref<any>(null);

/**
 * INITIALISATION MANUELLE : Zéro random, zéro erreur TypeScript.
 */
const openAdd = () => {
  isEditing.value = false;
  currentInv.value = {
    prestataire: '',
    categorie: '',
    montant: 0,
    dateEmission: new Date().toISOString().split('T')[0],
    dateEcheance: ''
  };
  isModalOpen.value = true;
};

const handleSave = async (vals: any) => {
  if (isEditing.value && currentInv.value?.id) {
    await update({ ...vals, id: currentInv.value.id });
  } else {
    await add(vals);
  }
  isModalOpen.value = false;
};

await useFetch<any[]>('/api/invoices/list', {
  key: 'invoices-main-stable',
  onResponse({ response }) { store.invoices = response._data || []; }
});
</script>

<template>
  <InvoiceLayout :is-modal-open="isModalOpen" @close-modal="isModalOpen = false">
    
    <template #add-button>
      <button 
        @click="openAdd" 
        class="flex items-center gap-4 border border-white/5 rounded-2xl px-6 py-4 bg-stone-900/40 hover:bg-stone-900/60 transition-all group shadow-xl"
      >
        <div class="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center text-blue-500 shadow-inner group-hover:scale-110 transition-transform">
          <UIcon name="i-heroicons-plus-circle" class="w-6 h-6" />
        </div>
        <span class="text-stone-400 group-hover:text-white font-black uppercase tracking-widest text-[10px]">
          Ajouter une facture
        </span>
      </button>
    </template>

    <template #filter-select>
      <div class="flex items-center gap-4">
        <select v-model="sortKey" class="input-stellar select-stellar min-w-[160px]">
          <option value="dateEmission">Tri : Émission</option>
          <option value="prestataire">Tri : Nom</option>
          <option value="montant">Tri : Montant</option>
        </select>

        <select v-model="statusFilter" class="input-stellar select-stellar min-w-[160px]" :class="{'text-blue-500': statusFilter !== 'TOUS'}">
          <option value="TOUS">Tous les États</option>
          <option value="PAYÉE">État : Payées</option>
          <option value="EN RETARD">État : Retard</option>
        </select>
      </div>
    </template>

    <InvoiceRow 
      v-for="inv in sortedInvoices" 
      :key="inv.id" 
      :invoice="inv" 
      @pay="pay" 
      @edit="(i) => { isEditing = true; currentInv = {...i}; isModalOpen = true; }" 
      @delete="remove" 
    />

    <template #modal-content>
      <InvoiceForm 
        :is-editing="isEditing" 
        :initial-values="currentInv" 
        @submit="handleSave" 
        @cancel="isModalOpen = false" 
      />
    </template>

  </InvoiceLayout>
</template>