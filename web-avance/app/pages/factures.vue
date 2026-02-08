<script setup lang="ts">
/**
 * @file pages/invoices.vue
 * @description Rendu avec pré-remplissage EDF et filtres synchronisés.
 */
definePageMeta({ title: 'FACTURES', middleware: 'auth' });

const store = useInvoiceStore();
const { sortKey, statusFilter, sortedInvoices, add, update, remove, pay } = useInvoices();

const sortOrder = ref<'CROISSANT' | 'DECROISSANT'>('DECROISSANT');
const isModalOpen = ref(false);
const isEditing = ref(false);
const currentInv = ref<any>(null);

const orderedInvoices = computed(() => {
  const list = [...sortedInvoices.value];
  return sortOrder.value === 'DECROISSANT' ? list : list.reverse();
});

const openAdd = () => {
  isEditing.value = false;
  const dateObj = new Date();
  dateObj.setDate(dateObj.getDate() + 2); // J+2 pour l'échéance par défaut
  
  currentInv.value = {
    prestataire: 'EDF',
    categorie: 'Énergie',
    montant: 10,
    dateEmission: new Date().toISOString().split('T')[0],
    dateEcheance: dateObj.toISOString().split('T')[0]
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
  key: 'invoices-display-stable',
  onResponse({ response }) { store.invoices = response._data || []; }
});
</script>

<template>
  <InvoiceLayout :is-modal-open="isModalOpen" @close-modal="isModalOpen = false">
    
    <template #add-button>
      <button @click="openAdd" class="flex items-center gap-4 border border-white/5 rounded-2xl px-6 py-4 bg-stone-900/40 hover:bg-stone-900/60 transition-all group shadow-xl">
        <div class="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center text-blue-500 shadow-inner group-hover:scale-110 transition-transform">
          <UIcon name="i-heroicons-plus-circle" class="w-6 h-6" />
        </div>
        <span class="text-stone-400 group-hover:text-white font-black uppercase tracking-widest text-[10px]">Nouvelle facture</span>
      </button>
    </template>

    <template #filter-select>
      <div class="flex items-center gap-3">
        <select v-model="sortKey" class="input-stellar select-stellar min-w-[140px]">
          <option value="dateEmission">Émission</option>
          <option value="dateEcheance">Échéance</option>
          <option value="prestataire">Prestataire</option>
          <option value="montant">Montant</option>
        </select>

        <select v-model="sortOrder" class="input-stellar select-stellar min-w-[110px]">
          <option value="DECROISSANT">DECROISSANT</option>
          <option value="CROISSANT">CROISSANT</option>
        </select>

        <select v-model="statusFilter" class="input-stellar select-stellar min-w-[150px]" :class="{'text-blue-500': statusFilter !== 'TOUS'}">
          <option value="TOUS">Tous les États</option>
          <option value="PAYÉE">Payées</option>
          <option value="EN RETARD">Retard</option>
          <option value="VIGILANCE">Vigilance</option>
        </select>
      </div>
    </template>

    <InvoiceRow 
      v-for="inv in orderedInvoices" 
      :key="inv.id" 
      :invoice="inv" 
      @pay="pay" 
      @edit="(i) => { isEditing = true; currentInv = {...i}; isModalOpen = true; }" 
      @delete="remove" 
    />

    <template #modal-content>
      <InvoiceForm :is-editing="isEditing" :initial-values="currentInv" @submit="handleSave" @cancel="isModalOpen = false" />
    </template>

  </InvoiceLayout>
</template>

<style scoped>
.select-stellar {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23444' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 0.8rem;
  padding-right: 2.5rem !important;
}
</style>