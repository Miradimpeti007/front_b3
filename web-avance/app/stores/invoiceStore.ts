import { defineStore } from 'pinia';
import { useAuthStore } from './authStore';

/**
 * Invoice Interface
 * Defines the structure of a household charge
 */
export interface Invoice {
  id: string;
  prestataire: string;
  categorie: string;
  montant: number;
  dateEmission: string;
  dateEcheance: string;
  isPaid: boolean;
}

/**
 * Global Invoice Store
 * Orchestrates invoice data flow and synchronizes progression with AuthStore
 */
export const useInvoiceStore = defineStore('invoice', () => {
  const authStore = useAuthStore();
  const invoices = ref<Invoice[]>([]);
  const loading = ref(false);

  /**
   * Refreshes the local list from the persistence layer
   */
  async function refresh() {
    if (!authStore.isAuthenticated) return;
    
    loading.value = true;
    try {
      const data = await $fetch<Invoice[]>('/api/invoices/list');
      invoices.value = data;
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
    } finally {
      loading.value = false;
    }
  }

  /**
   * Adds a new invoice and refreshes the state
   */
  async function addInvoice(invoiceData: Partial<Invoice>) {
    try {
      await $fetch('/api/invoices/add', {
        method: 'POST',
        body: invoiceData
      });
      await refresh();
    } catch (error) {
      console.error('Failed to add invoice:', error);
    }
  }

  /**
 * Updates an existing invoice with full data set
 */
async function updateInvoice(invoiceData: Invoice) {
  try {
    await $fetch('/api/invoices/update', {
      method: 'PATCH',
      body: invoiceData
    });
    await refresh();
  } catch (error) {
    console.error('Failed to update invoice:', error);
  }
}

  /**
   * Triggers the payment process and updates user progression
   * Logic: Syncs Level/XP from server response to the AuthStore
   */
  async function payInvoice(id: string) {
    try {
      const response = await $fetch<any>('/api/invoices/pay', {
        method: 'PATCH',
        body: { id }
      });

      if (response.success && response.progression && authStore.user) {
        authStore.user.level = response.progression.level;
        authStore.user.xp = response.progression.xp;
        authStore.user.nextLevelXp = response.progression.nextLevelXp;
        
        await refresh();
        return response.progression;
      }
    } catch (error) {
      console.error('Payment process failed:', error);
    }
    return null;
  }

  /**
   * Deletes an invoice entry
   */
  async function deleteInvoice(id: string) {
    try {
      await $fetch('/api/invoices/delete', {
        method: 'DELETE',
        body: { id }
      });
      await refresh();
    } catch (error) {
      console.error('Failed to delete invoice:', error);
    }
  }

  return {
    invoices,
    loading,
    refresh,
    addInvoice,
    updateInvoice,
    payInvoice,
    deleteInvoice
  };
});