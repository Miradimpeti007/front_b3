import { defineStore } from 'pinia';

/**
 * @file stores/invoiceStore.ts
 * @description Store minimaliste contenant uniquement la source de vérité.
 */
export const useInvoiceStore = defineStore('invoice', () => {
  const invoices = ref<any[]>([]);
  return { invoices };
});