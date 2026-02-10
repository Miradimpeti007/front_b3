<script setup lang="ts">
/**
 * @file pages/dashboard.vue
 * @description Dashboard synchronisé sur les catégories pour récupérer les tâches.
 */
definePageMeta({ middleware: 'auth' });

const router = useRouter();
const authStore = useAuthStore();

/**
 * RÉCUPÉRATION PÉRENNISÉE
 * On utilise les mêmes routes que tes pages principales.
 */
const { data: rawInvoices, refresh: refreshInv } = await useFetch<any[]>('/api/invoices/list', { 
  key: 'dashboard-inv-sync' 
});

// On récupère les CATÉGORIES pour en extraire les TÂCHES
const { data: rawCategories, refresh: refreshCats } = await useFetch<any[]>('/api/categories/list', { 
  key: 'dashboard-cats-sync' 
});

const refreshAll = () => {
  refreshInv();
  refreshCats();
};

/**
 * CALCULS LOCAUX
 */
const stats = computed(() => {
  const invoices = rawInvoices.value || [];
  
  // EXTRACTION DES TÂCHES : On aplatit les tâches de toutes les catégories
  const categories = rawCategories.value || [];
  const allTasks = categories.flatMap(cat => cat.tasks || []);
  
  const householdSize = authStore.user?.householdSize || 1;
  const payees = invoices.filter(i => i.isPaid);
  const aPayer = invoices.filter(i => !i.isPaid);
  
  const totalPaye = payees.reduce((acc, curr) => acc + curr.montant, 0);
  const totalARegler = aPayer.reduce((acc, curr) => acc + curr.montant, 0);
  const partParPersonne = (totalPaye + totalARegler) / householdSize;

  // Graphique dynamique (7 derniers jours)
  const joursSemaine = ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'];
  const chartData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const label = joursSemaine[d.getDay()];
    const montantJour = invoices
      .filter(inv => inv.dateEmission === dateStr)
      .reduce((acc, curr) => acc + curr.montant, 0);
    chartData.push({ label, montant: montantJour });
  }

  const record = [...payees].sort((a, b) => b.montant - a.montant)[0];
  const urgences = [...aPayer].sort((a, b) => new Date(a.dateEcheance).getTime() - new Date(b.dateEcheance).getTime());

  return {
    totalPaye,
    totalARegler,
    partParPersonne,
    householdSize,
    maxPaye: record?.montant || 0,
    prestataireMax: record?.prestataire || '---',
    prochaineEcheance: urgences[0]?.dateEcheance.split('-').reverse().join('/') || '---',
    nbRetards: aPayer.filter(i => new Date(i.dateEcheance).getTime() < Date.now()).length,
    tachesRestantes: allTasks.filter(t => !t.isDone).length,
    chart: chartData,
    maxChart: Math.max(...chartData.map(d => d.montant), 10),
    listeUrgences: urgences.slice(0, 3),
    // Les 3 premières quêtes non terminées extraites des catégories
    listeQuetes: allTasks.filter(t => !t.isDone).slice(0, 3)
  };
});
</script>

<template>
  <div class="flex flex-col gap-10 pb-16">
    
    <div class="flex justify-between items-end px-4">
      <div>
        <h1 class="text-4xl font-black text-white uppercase italic tracking-tighter">Flux Analytique</h1>
        <p class="text-stone-500 text-[10px] font-bold uppercase tracking-[0.3em]">Base de données synchronisée</p>
      </div>
      <button @click="refreshAll" class="p-3 bg-stone-900 border border-white/5 rounded-2xl text-stone-500 hover:text-blue-500 transition-all">
        <UIcon name="i-heroicons-arrow-path" class="w-5 h-5" />
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 px-2">
      <DashboardKpi label="Total Payé" :value="`${stats.totalPaye.toFixed(2)}€`" variant="success" footer="Validé en base" />
      <DashboardKpi label="Record" :value="`${stats.maxPaye.toFixed(2)}€`" :footer="stats.prestataireMax" />
      <DashboardKpi label="À Régler" :value="`${stats.totalARegler.toFixed(2)}€`" variant="danger" :footer="`${stats.nbRetards} EN RETARD`" />
      <DashboardKpi label="Part / Foyer" :value="`${stats.partParPersonne.toFixed(2)}€`" variant="info" :footer="`${stats.householdSize} membres`" />
      <DashboardKpi label="Prochain" :value="stats.prochaineEcheance" variant="default" footer="Priorité haute" />
    </div>

    <ActivityChart :data="stats.chart" :max="stats.maxChart" />

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="space-y-6">
        <h2 class="text-[11px] font-black text-stone-500 uppercase tracking-widest px-4 italic">Priorités Financières</h2>
        <div class="flex flex-col gap-3">
          <div v-for="inv in stats.listeUrgences" :key="inv.id" class="bg-stone-900/60 border border-white/5 p-6 rounded-[2rem] flex justify-between items-center group shadow-xl">
            <div class="flex flex-col">
              <span class="text-[10px] font-black text-white uppercase">{{ inv.prestataire }}</span>
              <span class="text-[8px] font-bold text-red-500 uppercase italic">Échéance : {{ inv.dateEcheance.split('-').reverse().join('/') }}</span>
            </div>
            <span class="text-sm font-black text-amber-500">{{ inv.montant.toFixed(2) }}€</span>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="flex justify-between items-center px-4">
          <h2 class="text-[11px] font-black text-stone-500 uppercase tracking-widest italic">Quêtes Actives</h2>
          <span class="text-[9px] font-black text-blue-500 uppercase">{{ stats.tachesRestantes }} Restantes</span>
        </div>
        <div class="flex flex-col gap-3">
          <div v-for="t in stats.listeQuetes" :key="t.id" class="bg-stone-900/60 border border-white/5 p-6 rounded-[2rem] flex justify-between items-center group shadow-xl">
            <span class="text-[10px] font-black text-stone-300 uppercase tracking-widest">{{ t.title }}</span>
            <button @click="router.push('/taches')" class="text-[8px] font-black text-stone-500 hover:text-white uppercase transition-colors">Détails</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>