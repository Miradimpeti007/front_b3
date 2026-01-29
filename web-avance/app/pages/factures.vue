<template>
  <div class="h-[calc(100vh-120px)] flex flex-col">
    <header class="mb-12 flex-none">
      <section 
        @click="openAddModal"
        class="cursor-pointer border border-white/10 rounded-2xl px-6 py-4 hover:bg-stone-900/60 transition-all group w-fit bg-stone-900/20 backdrop-blur-sm shadow-xl"
      >
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform shadow-inner text-blue-500">
             <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
               <path d="M12 5v14M5 12h14"/>
             </svg>
          </div>
          <p class="text-stone-400 group-hover:text-white font-black uppercase tracking-[0.2em] text-[10px]">
            Ajouter une facture
          </p>
        </div>
      </section>
    </header>

    <div class="grid grid-cols-[50px_2fr_1fr_1fr_1fr_1fr_100px] px-8 mb-4 items-center flex-none">
      <span></span>
      <span class="text-[9px] font-black uppercase tracking-[0.3em] text-stone-600">Prestataire</span>
      <span class="text-[9px] font-black uppercase tracking-[0.3em] text-stone-600 text-center">Émission</span>
      <span class="text-[9px] font-black uppercase tracking-[0.3em] text-stone-600 text-center">Échéance</span>
      <span class="text-[9px] font-black uppercase tracking-[0.3em] text-stone-600 text-center">Montant</span>
      <span class="text-[9px] font-black uppercase tracking-[0.3em] text-stone-600 text-center">État</span>
      <span class="text-[9px] font-black uppercase tracking-[0.3em] text-stone-600 text-right">Actions</span>
    </div>

    <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-4">
      <div 
        v-for="invoice in invoiceStore.invoices" 
        :key="invoice.id"
        class="grid grid-cols-[50px_2fr_1fr_1fr_1fr_1fr_100px] items-center bg-stone-900/40 border border-white/5 rounded-2xl p-5 hover:border-white/20 transition-all shadow-xl backdrop-blur-sm group"
        :class="{ 'opacity-40 grayscale-[0.5]': invoice.isPaid }"
      >
        <div class="flex justify-center">
          <UCheckbox 
            :model-value="invoice.isPaid" 
            :disabled="invoice.isPaid"
            @change="handlePayment(invoice)"
            color="success"
            class="cursor-pointer"
          />
        </div>

        <div class="flex flex-col truncate pr-4">
          <span class="text-[11px] font-black uppercase tracking-widest text-white truncate">{{ invoice.prestataire }}</span>
          <span class="text-[9px] font-bold text-stone-500 uppercase">{{ invoice.categorie }}</span>
        </div>

        <div class="text-center">
          <span class="text-[10px] font-bold text-stone-500">{{ formatDate(invoice.dateEmission) }}</span>
        </div>

        <div class="text-center">
          <span class="text-[10px] font-black tracking-tight" :class="getDateColor(invoice)">
            {{ formatDate(invoice.dateEcheance) }}
          </span>
        </div>

        <div class="text-center">
          <span class="text-sm font-black text-amber-500 tracking-tighter">{{ invoice.montant.toFixed(2) }} €</span>
        </div>

        <div class="flex justify-center">
          <div 
            class="px-4 py-1.5 rounded-full border text-[8px] font-black uppercase tracking-[0.15em]"
            :class="getStatusStyle(invoice)"
          >
            {{ calculateStatus(invoice) }}
          </div>
        </div>

        <div class="flex justify-end items-center gap-2">
          <button 
            @click="openEditModal(invoice)"
            :disabled="invoice.isPaid"
            class="p-2 transition-colors"
            :class="invoice.isPaid ? 'text-stone-800 cursor-not-allowed' : 'text-stone-500 hover:text-blue-500'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>

          <button @click="invoiceStore.deleteInvoice(invoice.id)" class="p-2 text-stone-700 hover:text-error transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div v-if="invoiceStore.invoices.length === 0" class="py-20 text-center border-2 border-dashed border-white/5 rounded-[2rem]">
        <p class="text-stone-600 font-bold uppercase tracking-widest text-xs italic">Aucune charge enregistrée</p>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div @click="isModalOpen = false" class="absolute inset-0 bg-black/80 backdrop-blur-md"></div>
        <div class="relative bg-zinc-900 border border-white/10 w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl">
          <h2 class="text-xl font-black text-white mb-8 uppercase tracking-widest text-center border-b border-white/5 pb-4">
            {{ isEditing ? 'Modifier Facture' : 'Nouvelle Facture' }}
          </h2>
          <form @submit.prevent="submitForm" class="space-y-6 mb-10">
            <div class="grid grid-cols-2 gap-4">
              <input v-model="form.prestataire" type="text" placeholder="PRESTATAIRE" class="input-stellar" required />
              <input v-model="form.categorie" type="text" placeholder="CATÉGORIE" class="input-stellar" required />
            </div>
            <input v-model="form.montant" type="number" step="0.01" placeholder="MONTANT" class="input-stellar" required />
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <p class="text-[9px] font-black text-stone-500 uppercase ml-2">Émission</p>
                <input v-model="form.dateEmission" type="date" class="input-stellar" required />
              </div>
              <div class="space-y-1">
                <p class="text-[9px] font-black text-stone-500 uppercase ml-2">Échéance</p>
                <input v-model="form.dateEcheance" type="date" class="input-stellar" required />
              </div>
            </div>
            <div class="flex gap-4 pt-4">
              <button type="button" @click="isModalOpen = false" class="flex-1 text-stone-500 font-black uppercase text-[10px] tracking-widest hover:text-white transition-colors">Annuler</button>
              <button type="submit" class="flex-2 bg-blue-600 text-white py-4 px-10 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all">
                {{ isEditing ? 'Mettre à jour' : 'Enregistrer' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
/**
 * Invoices view with isolated scrollable list.
 * Fixed: TypeScript errors for random generation and ISO strings.
 */
definePageMeta({ title: 'FACTURES', middleware: 'auth' })

const invoiceStore = useInvoiceStore()
const authStore = useAuthStore()
const toast = useToast()

const isModalOpen = ref(false)
const isEditing = ref(false)
const editingId = ref<string | null>(null)

const form = ref({
  prestataire: '',
  categorie: '',
  montant: 0,
  dateEmission: '',
  dateEcheance: ''
})

const mockData = [
  { p: 'EDF', c: 'Énergie' },
  { p: 'Netflix', c: 'Streaming' },
  { p: 'Loyer', c: 'Logement' },
  { p: 'SFR Business', c: 'Internet' },
  { p: 'Eau de Valence', c: 'Eau' }
]

const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  const randomIndex = Math.floor(Math.random() * mockData.length)
  const random = mockData[randomIndex]
  const tomorrow = new Date(Date.now() + 86400000)

  form.value = {
    prestataire: random?.p || '',
    categorie: random?.c || '',
    montant: Number((Math.random() * 250 + 15).toFixed(2)),
    dateEmission: new Date().toISOString().split('T')[0] ?? '',
    dateEcheance: tomorrow.toISOString().split('T')[0] ?? ''
  }
  isModalOpen.value = true
}

const openEditModal = (invoice: any) => {
  isEditing.value = true
  editingId.value = invoice.id
  form.value = { ...invoice }
  isModalOpen.value = true
}

const submitForm = async () => {
  if (isEditing.value && editingId.value) {
    await invoiceStore.updateInvoice({ ...form.value, id: editingId.value } as any)
  } else {
    await invoiceStore.addInvoice({ ...form.value })
  }
  isModalOpen.value = false
}

const handlePayment = async (invoice: any) => {
  const result = await invoiceStore.payInvoice(invoice.id)
  if (result) {
    toast.add({
      title: 'Paiement validé !',
      description: `Gain d'expérience : +${result.gain} XP.`,
      icon: 'i-heroicons-sparkles',
      color: 'success'
    })
  }
}

const triggerAutomatedAlerts = () => {
  invoiceStore.invoices.forEach(invoice => {
    if (!invoice.isPaid) {
      const status = calculateStatus(invoice)
      if (status === 'EN RETARD') {
        toast.add({ title: 'Alerte Retard', description: `${invoice.prestataire} est expiré.`, color: 'error', icon: 'i-heroicons-exclamation-circle' })
      } else if (status === 'VIGILANCE') {
        toast.add({ title: 'Vigilance', description: `Échéance proche (< 24h) : ${invoice.prestataire}`, color: 'warning', icon: 'i-heroicons-clock' })
      }
    }
  })
}

const calculateStatus = (invoice: any) => {
  if (invoice.isPaid) return 'PAYÉE'
  const diff = new Date(invoice.dateEcheance).getTime() - new Date().getTime()
  if (diff < 0) return 'EN RETARD'
  if (diff <= 86400000) return 'VIGILANCE'
  return 'EN ATTENTE'
}

const getStatusStyle = (invoice: any) => {
  const status = calculateStatus(invoice)
  if (status === 'PAYÉE') return 'bg-green-500/10 border-green-500/20 text-green-500'
  if (status === 'EN RETARD') return 'bg-red-500/10 border-red-500/20 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]'
  if (status === 'VIGILANCE') return 'bg-amber-500/10 border-amber-500/20 text-amber-500'
  return 'bg-stone-800/40 border-white/5 text-stone-500'
}

const getDateColor = (invoice: any) => {
  if (invoice.isPaid) return 'text-stone-600'
  return calculateStatus(invoice) === 'EN RETARD' ? 'text-red-400 animate-pulse' : 'text-stone-400'
}

const formatDate = (d: string) => d.split('-').reverse().join('/')

onMounted(async () => {
  await invoiceStore.refresh()
  triggerAutomatedAlerts()
})

const { data, status, pending, error, refresh, clear } = await useAsyncData(
  'invoices',
  () => $fetch('/api/invoice'),
  { watch: []
  }
)

provide("invoices", { data, status, pending, error, refresh, clear });
</script>

<style>
.input-stellar {
  width: 100%;
  background-color: #1c1917;
  border: 1px solid #44403c;
  color: white;
  border-radius: 1rem;
  padding: 1.25rem;
  outline: none;
  text-transform: uppercase;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.1em;
  transition: all 0.2s;
}
.input-stellar:focus {
  border-color: #3b82f6;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}
</style>