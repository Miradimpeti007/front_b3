/**
 * @file composables/useInvoices.ts
 * @description Intégration de la logique Vigilance dans le pipeline de filtrage.
 */
export const useInvoices = () => {
  const store = useInvoiceStore();
  const auth = useAuthStore();

  const sortKey = useState<string>('inv-sort-key', () => 'dateEmission');
  const statusFilter = useState<string>('inv-status-filter', () => 'TOUS');

  const sortedInvoices = computed(() => {
    let list = [...store.invoices];

    // FILTRAGE : Ajout de la logique Vigilance (J-1)
    if (statusFilter.value !== 'TOUS') {
      list = list.filter(inv => {
        const now = Date.now();
        const due = new Date(inv.dateEcheance).getTime();
        const diff = due - now;

        let status = 'EN ATTENTE';
        if (inv.isPaid) {
          status = 'PAYÉE';
        } else if (diff < 0) {
          status = 'EN RETARD';
        } else if (diff <= 86400000) { // 24 heures en millisecondes
          status = 'VIGILANCE';
        }

        return status === statusFilter.value;
      });
    }

    // TRI : Utilisation de la clé sélectionnée
    return list.sort((a, b) => {
      const key = sortKey.value;
      if (key === 'montant') return b.montant - a.montant;
      return (a[key] || '').toString().localeCompare((b[key] || '').toString());
    });
  });

  // Méthodes API (inchangées)
  const fetchAll = async () => { store.invoices = await $fetch('/api/invoices/list') || []; };
  const add = async (body: any) => { await $fetch('/api/invoices/add', { method: 'POST', body }); await fetchAll(); };
  const update = async (body: any) => { await $fetch('/api/invoices/update', { method: 'PATCH', body }); await fetchAll(); };
  const remove = async (id: string) => { await $fetch('/api/invoices/delete', { method: 'DELETE', body: { id } }); await fetchAll(); };
  const pay = async (id: string) => {
    const res = await $fetch<any>('/api/invoices/pay', { method: 'PATCH', body: { id } });
    if (res.success && auth.user) {
      auth.user.level = res.progression.level;
      auth.user.xp = res.progression.xp;
      auth.user.nextLevelXp = res.progression.nextLevelXp;
      await fetchAll();
      return res.progression;
    }
  };

  return { sortKey, statusFilter, sortedInvoices, add, update, remove, pay, fetchAll };
};