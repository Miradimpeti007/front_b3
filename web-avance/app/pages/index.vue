<template>
  <div class="flex flex-col gap-8 pb-12 min-h-screen">
    
    <div class="flex flex-col gap-1 px-4">
      <h1 class="text-3xl font-black text-white uppercase tracking-tighter italic">Tableau de Bord</h1>
      <p class="text-stone-500 text-[10px] font-bold uppercase tracking-[0.3em]">Analyse des performances et flux financiers</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-stone-900/40 border border-white/5 p-6 rounded-[2rem] backdrop-blur-sm shadow-xl">
        <p class="text-stone-500 text-[9px] font-black uppercase tracking-widest mb-1">Total Payé</p>
        <h3 class="text-2xl font-black text-green-500 tracking-tighter">{{ stats.totalPaye.toFixed(2) }} €</h3>
        <p class="text-stone-600 text-[8px] font-bold uppercase mt-2">Investi dans le système</p>
      </div>

      <div class="bg-stone-900/40 border border-white/5 p-6 rounded-[2rem] shadow-xl">
        <p class="text-stone-500 text-[9px] font-black uppercase tracking-widest mb-1">Record Paiement</p>
        <h3 class="text-2xl font-black text-white tracking-tighter">{{ stats.maxPaye.toFixed(2) }} €</h3>
        <p class="text-stone-600 text-[8px] font-bold uppercase mt-2">{{ stats.prestataireRecord }}</p>
      </div>

      <div class="bg-red-500/5 border border-red-500/20 p-6 rounded-[2rem] shadow-xl">
        <p class="text-red-400 text-[9px] font-black uppercase tracking-widest mb-1">À Régler</p>
        <h3 class="text-2xl font-black text-red-500 tracking-tighter">{{ stats.totalARegler.toFixed(2) }} €</h3>
        <p class="text-red-900 text-[8px] font-black uppercase mt-2">{{ stats.nbRetards }} EN RETARD</p>
      </div>

      <div class="bg-blue-500/5 border border-blue-500/20 p-6 rounded-[2rem] shadow-xl">
        <p class="text-blue-400 text-[9px] font-black uppercase tracking-widest mb-1">Prochain Débit</p>
        <h3 class="text-2xl font-black text-white tracking-tighter">{{ stats.montantProchainDebit.toFixed(2) }} €</h3>
        <p class="text-blue-900 text-[8px] font-black uppercase mt-2">{{ stats.dateProchainDebit }}</p>
      </div>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 px-2">
      <div class="bg-stone-900/40 border border-white/5 p-5 rounded-2xl flex flex-col items-center justify-center text-center">
        <span class="text-[8px] font-black text-stone-500 uppercase tracking-widest mb-1">Total Tâches</span>
        <span class="text-xl font-black text-white">{{ stats.totalTaches }}</span>
      </div>
      <div class="bg-green-500/5 border border-green-500/10 p-5 rounded-2xl flex flex-col items-center justify-center text-center">
        <span class="text-[8px] font-black text-green-700 uppercase tracking-widest mb-1">Terminées</span>
        <span class="text-xl font-black text-green-500">{{ stats.tachesFaites }}</span>
      </div>
      <div class="bg-blue-500/5 border border-blue-500/10 p-5 rounded-2xl flex flex-col items-center justify-center text-center">
        <span class="text-[8px] font-black text-blue-700 uppercase tracking-widest mb-1">Restantes</span>
        <span class="text-xl font-black text-blue-500">{{ stats.tachesRestantes }}</span>
      </div>
      <div class="bg-stone-900/40 border border-white/5 p-5 rounded-2xl flex flex-col items-center justify-center text-center overflow-hidden">
        <span class="text-[8px] font-black text-stone-500 uppercase tracking-widest mb-1">Top Catégorie</span>
        <span class="text-[10px] font-black text-white uppercase truncate w-full">{{ stats.topCategorie }}</span>
      </div>
    </div>

    <section class="bg-stone-900/40 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl overflow-hidden">
      <div class="flex justify-between items-center mb-12 px-2">
        <h2 class="text-[11px] font-black text-white uppercase tracking-[0.4em]">Flux d'activité financier</h2>
        <span class="px-3 py-1 bg-stone-800 text-stone-500 text-[8px] font-black rounded-full border border-white/5 uppercase">7 derniers jours</span>
      </div>
      
      <div class="relative h-56 w-full flex items-end justify-between gap-4 px-6">
        <div v-for="(jour, index) in stats.donneesGraphique" :key="index" class="flex-1 flex flex-col items-center gap-4 group h-full justify-end">
          <div 
            class="w-full bg-gradient-to-t from-blue-600/40 to-blue-500 rounded-t-xl transition-all duration-700 relative"
            :style="{ height: (jour.montant / stats.maxGraphique * 100) + '%' }"
          >
            <div class="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 text-[9px] font-black text-white bg-stone-800 px-3 py-1 rounded-lg border border-white/10 whitespace-nowrap z-20">
              {{ jour.montant }} €
            </div>
          </div>
          <span class="text-[9px] font-black text-stone-600 uppercase">{{ jour.label }}</span>
        </div>
      </div>
    </section>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      <div class="space-y-6">
        <h2 class="text-[11px] font-black text-stone-500 uppercase tracking-[0.4em] px-4 italic">Hub d'État : Urgences</h2>
        <div class="flex flex-col gap-3">
          <div v-for="facture in stats.urgences" :key="facture.id" 
               class="bg-stone-900/60 border border-white/5 p-5 rounded-3xl flex justify-between items-center group hover:border-red-500/30 transition-all shadow-xl">
            <div class="flex flex-col">
              <span class="text-[10px] font-black text-white uppercase tracking-widest">{{ facture.prestataire }}</span>
              <span class="text-[8px] font-bold text-red-500 uppercase italic">Échéance : {{ formaterDate(facture.dateEcheance) }}</span>
            </div>
            <div class="flex items-center gap-6">
              <span class="text-sm font-black text-amber-500">{{ facture.montant.toFixed(2) }} €</span>
              <button @click="router.push('/factures')" class="p-2 bg-stone-800 rounded-xl text-stone-400 group-hover:text-white transition-colors">
                <UIcon name="i-heroicons-credit-card" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="flex justify-between items-center px-4">
          <h2 class="text-[11px] font-black text-stone-500 uppercase tracking-[0.4em] italic">Journal de Quêtes</h2>
          <span class="text-[9px] font-black text-blue-500 uppercase">Potentiel : +{{ stats.tachesRestantes * 10 }} XP</span>
        </div>
        <div class="flex flex-col gap-3">
          <div v-for="tache in stats.quetesPrioritaires" :key="tache.id" 
               class="bg-stone-900/60 border border-white/5 p-5 rounded-3xl flex justify-between items-center group hover:border-blue-500/30 transition-all shadow-xl">
            <div class="flex items-center gap-4">
              <div class="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
              <span class="text-[10px] font-black text-stone-300 uppercase tracking-widest">{{ tache.title }}</span>
            </div>
            <button @click="router.push('/taches')" class="text-[8px] font-black text-stone-600 bg-stone-800 px-4 py-2 rounded-xl uppercase hover:text-white hover:bg-stone-700 transition-all">
              Action Requise
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Dashboard Analytique Final - Finance & Quêtes
 */
definePageMeta({ middleware: 'auth' })

const authStore = useAuthStore()
const taskStore = useTaskStore()
const invoiceStore = useInvoiceStore()
const router = useRouter()

const stats = computed(() => {
  const factures = invoiceStore.invoices
  const payees = factures.filter(i => i.isPaid)
  const aPayer = factures.filter(i => !i.isPaid)
  
  // Statistiques Tâches
  const toutesLesTaches = taskStore.categories.flatMap(c => c.tasks)
  const nbTachesFaites = toutesLesTaches.filter(t => t.isDone).length
  
  // Analyse des catégories
  const categoriesTriees = [...taskStore.categories].sort((a, b) => b.tasks.length - a.tasks.length)
  const topCat = categoriesTriees[0]?.nom || 'Aucune'

  // Records et Échéances
  const factureRecord = [...payees].sort((a, b) => b.montant - a.montant)[0]
  const trieesParDate = [...aPayer].sort((a, b) => new Date(a.dateEcheance).getTime() - new Date(b.dateEcheance).getTime())
  const prochaine = trieesParDate[0]

  // Graphique (Basé sur tes records réels ou simulation)
  const graphique = [
    { label: 'LUN', montant: 45 }, { label: 'MAR', montant: 120 }, { label: 'MER', montant: 60 },
    { label: 'JEU', montant: 190 }, { label: 'VEN', montant: 15 }, { label: 'SAM', montant: 5 }, { label: 'DIM', montant: 75 }
  ]

  return {
    totalPaye: payees.reduce((acc, curr) => acc + curr.montant, 0),
    maxPaye: factureRecord?.montant || 0,
    prestataireRecord: factureRecord?.prestataire || 'Aucun record',
    totalARegler: aPayer.reduce((acc, curr) => acc + curr.montant, 0),
    nbRetards: aPayer.filter(i => new Date(i.dateEcheance) < new Date()).length,
    montantProchainDebit: prochaine?.montant || 0,
    dateProchainDebit: prochaine ? formaterDate(prochaine.dateEcheance) : '31/01/2026',
    totalTaches: toutesLesTaches.length,
    tachesFaites: nbTachesFaites,
    tachesRestantes: toutesLesTaches.length - nbTachesFaites,
    topCategorie: topCat,
    donneesGraphique: graphique,
    maxGraphique: Math.max(...graphique.map(d => d.montant)) * 1.2,
    urgences: trieesParDate.slice(0, 3),
    quetesPrioritaires: toutesLesTaches.filter(t => !t.isDone).slice(0, 3)
  }
})

const formaterDate = (d: string) => d.split('-').reverse().join('/')



const invoices = inject("invoices")
</script>