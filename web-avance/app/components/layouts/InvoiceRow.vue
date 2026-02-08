<script setup lang="ts">
/**
 * @file components/molecules/InvoiceRow.vue
 * @description Molécule représentant une ligne unique de facture.
 */
const props = defineProps<{ invoice: any }>();
defineEmits(['pay', 'edit', 'delete']);

const calculateStatus = (inv: any) => {
  if (inv.isPaid) return 'PAYÉE';
  const diff = new Date(inv.dateEcheance).getTime() - new Date().getTime();
  return diff < 0 ? 'EN RETARD' : (diff <= 86400000 ? 'VIGILANCE' : 'EN ATTENTE');
};

const getStatusStyle = (inv: any) => {
  const status = calculateStatus(inv);
  if (status === 'PAYÉE') return 'bg-green-500/10 border-green-500/20 text-green-500';
  if (status === 'EN RETARD') return 'bg-red-500/10 border-red-500/20 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]';
  return status === 'VIGILANCE' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-stone-800/40 border-white/5 text-stone-500';
};

const formatDate = (d: string) => d.split('-').reverse().join('/');
</script>

<template>
  <div class="grid grid-cols-[50px_2fr_1fr_1fr_1fr_1fr_100px] items-center bg-stone-900/40 border border-white/5 rounded-2xl p-5 hover:border-white/20 transition-all shadow-xl backdrop-blur-sm group"
       :class="{ 'opacity-40 grayscale-[0.5]': invoice.isPaid }">
    <div class="flex justify-center">
      <UCheckbox :model-value="invoice.isPaid" :disabled="invoice.isPaid" @change="$emit('pay', invoice.id)" color="success" />
    </div>
    <div class="flex flex-col truncate pr-4">
      <span class="text-[11px] font-black uppercase tracking-widest text-white truncate">{{ invoice.prestataire }}</span>
      <span class="text-[9px] font-bold text-stone-500 uppercase">{{ invoice.categorie }}</span>
    </div>
    <div class="text-center text-[10px] font-bold text-stone-500">{{ formatDate(invoice.dateEmission) }}</div>
    <div class="text-center text-[10px] font-black tracking-tight" :class="calculateStatus(invoice) === 'EN RETARD' ? 'text-red-400 animate-pulse' : 'text-stone-400'">
      {{ formatDate(invoice.dateEcheance) }}
    </div>
    <div class="text-center text-sm font-black text-amber-500 tracking-tighter">{{ invoice.montant.toFixed(2) }} €</div>
    <div class="flex justify-center">
      <div class="px-4 py-1.5 rounded-full border text-[8px] font-black uppercase tracking-[0.15em]" :class="getStatusStyle(invoice)">
        {{ calculateStatus(invoice) }}
      </div>
    </div>
    <div class="flex justify-end items-center gap-2">
      <button @click="$emit('edit', invoice)" :disabled="invoice.isPaid" class="p-2 transition-colors" :class="invoice.isPaid ? 'text-stone-800' : 'text-stone-500 hover:text-blue-500'">
        <UIcon name="i-heroicons-pencil-square" class="w-4 h-4" />
      </button>
      <button @click="$emit('delete', invoice.id)" class="p-2 text-stone-700 hover:text-red-500 transition-colors">
        <UIcon name="i-heroicons-trash" class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>