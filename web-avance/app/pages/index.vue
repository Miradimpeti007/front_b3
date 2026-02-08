<script setup lang="ts">
/**
 * @file pages/dashboard.vue
 * @description Dashboard autonome. Récupère et calcule tout localement.
 */
definePageMeta({ middleware: 'auth' });

const router = useRouter();
const taskStore = useTaskStore(); // On garde juste pour les tâches si nécessaire

/**
 * RÉCUPÉRATION DIRECTE (Sans passer par le store pour l'affichage)
 * refresh permet de relancer la machine si besoin.
 */
const { data: rawInvoices, refresh } = await useFetch<any[]>('/api/invoices/list', {
  key: 'dashboard-direct-fetch',
  default: () => []
});

/**
 * CALCULS LOCAUX (Pas de logique "bizarre" dans le store)
 */
const stats = computed(() => {
  const invoices = rawInvoices.value || [];
  const tasks = taskStore.categories?.flatMap(c => c.tasks) || [];

  const payees = invoices.filter(i => i.isPaid);
  const aPayer = invoices.filter(i => !i.isPaid);
  
  // Statistiques financières
  const totalPaye = payees.reduce((acc, curr) => acc + curr.montant, 0);
  const totalARegler = aPayer.reduce((acc, curr) => acc + curr.montant, 0);
  const record = [...payees].sort((a, b) => b.montant - a.montant)[0];
  
  // Urgences (Uniquement non payées, triées par date)
  const urgences = [...aPayer].sort((a, b) => new Date(a.dateEcheance).getTime() - new Date(b.dateEcheance).getTime());
  const retards = aPayer.filter(i => new Date(i.dateEcheance).getTime() < Date.now()).length;

  // Graphique simulé (ou basé sur tes dates)
  const chartData = [
    { label: 'LUN', montant: 40 }, { label: 'MAR', montant: 110 }, { label: 'MER', montant: 80 },
    { label: 'JEU', montant: 150 }, { label: 'VEN', montant: 30 }, { label: 'SAM', montant: 10 }, { label: 'DIM', montant: 90 }
  ];

  return {
    totalPaye,
    totalARegler,
    maxPaye: record?.montant || 0,
    prestataireMax: record?.prestataire || '---',
    prochaineEcheance: urgences[0]?.dateEcheance.split('-').reverse().join('/') || '---',
    nbRetards: retards,
    tachesRestantes: tasks.filter(t => !t.isDone).length,
    chart: chartData,
    maxChart: Math.max(...chartData.map(d => d.montant)) * 1.2,
    listeUrgences: urgences.slice(0, 3),
    listeQuetes: tasks.filter(t => !t.isDone).slice(0, 3)
  };
});
</script>

<template>
  <div class="flex flex-col gap-10 pb-16">
    
    <div class="flex justify-between items-end px-4">
      <div>
        <h1 class="text-4xl font-black text-white uppercase italic tracking-tighter">Flux Analytique</h1>
        <p class="text-stone-500 text-[10px] font-bold uppercase tracking-[0.3em]">Analyse temps réel de la base</p>
      </div>
      <button @click="refresh()" class="p-3 bg-stone-900 border border-white/5 rounded-2xl text-stone-500 hover:text-blue-500 transition-colors">
        <UIcon name="i-heroicons-arrow-path" class="w-5 h-5" />
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <DashboardKpi label="Total Payé" :value="`${stats.totalPaye.toFixed(2)}€`" variant="success" footer="Validé en base" />
      <DashboardKpi label="Record" :value="`${stats.maxPaye.toFixed(2)}€`" :footer="stats.prestataireMax" />
      <DashboardKpi label="À Régler" :value="`${stats.totalARegler.toFixed(2)}€`" variant="danger" :footer="`${stats.nbRetards} EN RETARD`" />
      <DashboardKpi label="Prochain" :value="stats.prochaineEcheance" variant="info" footer="Échéance prioritaire" />
    </div>

    <ActivityChart :data="stats.chart" :max="stats.maxChart" />

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      <div class="space-y-6">
        <h2 class="text-[11px] font-black text-stone-500 uppercase tracking-widest px-4 italic">Priorités Financières</h2>
        <div class="flex flex-col gap-3">
          <div v-for="inv in stats.listeUrgences" :key="inv.id" class="bg-stone-900/60 border border-white/5 p-6 rounded-[2rem] flex justify-between items-center group shadow-xl transition-all hover:border-red-500/20">
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
          <div v-for="t in stats.listeQuetes" :key="t.id" class="bg-stone-900/60 border border-white/5 p-6 rounded-[2rem] flex justify-between items-center group shadow-xl transition-all hover:border-blue-500/20">
            <span class="text-[10px] font-black text-stone-300 uppercase tracking-widest">{{ t.title }}</span>
            <button @click="router.push('/taches')" class="text-[8px] font-black text-stone-500 hover:text-white uppercase transition-colors">Détails</button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>