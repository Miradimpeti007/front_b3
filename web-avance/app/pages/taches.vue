<template>
  <div class="min-h-screen">
    <section 
      @click="isCatModalOpen = true"
      class="mb-12 cursor-pointer border border-white/10 rounded-2xl px-6 py-4 hover:bg-stone-900/60 transition-all group w-fit bg-stone-900/20 backdrop-blur-sm shadow-xl"
    >
      <div class="flex items-center gap-4">
        <div class="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
           <img src="/Add_task_icone.png" alt="Add" class="w-5 h-5"/>
        </div>
        <p class="text-stone-400 group-hover:text-white font-black uppercase tracking-[0.2em] text-[10px]">Ajouter une catégorie</p>
      </div>
    </section>

    <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12 items-start justify-center">
      <TaskCategory 
        v-for="cat in taskStore.categories" 
        :key="cat.id" 
        :id="cat.id"
        :title="cat.nom"
        :tasks="cat.tasks"
        class="w-full"
        @add-task="ouvrirModalTache(cat.id)"
        @delete-category="taskStore.removeCategory"
        @toggle-task="taskStore.toggleTaskStatus"
        @delete-task="taskStore.removeTask"
      />
    </section>

    <Teleport to="body">
      <div v-if="isCatModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div @click="isCatModalOpen = false" class="absolute inset-0 bg-black/70 backdrop-blur-md"></div>
        <div class="relative bg-zinc-900 border border-white/10 w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl">
          <h2 class="text-2xl font-black text-white mb-8 uppercase tracking-widest">Nouvelle catégorie</h2>
          <input v-model="nouveauNomCat" @keyup.enter="creerCategorie" type="text" placeholder="Nom..." class="w-full bg-stone-800 border border-stone-700 text-white rounded-2xl p-5 mb-10 outline-none" autofocus />
          <div class="flex gap-6">
            <button @click="isCatModalOpen = false" class="flex-1 text-stone-500 font-bold uppercase text-xs">Annuler</button>
            <button @click="creerCategorie" class="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-xs">Confirmer</button>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="isTaskModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div @click="isTaskModalOpen = false" class="absolute inset-0 bg-black/70 backdrop-blur-md"></div>
        <div class="relative bg-zinc-900 border border-white/10 w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl">
          <h2 class="text-2xl font-black text-white mb-8 uppercase tracking-widest">Nouvelle tâche</h2>
          <div class="space-y-5 mb-10">
            <input v-model="newTask.title" type="text" placeholder="Titre..." class="w-full bg-stone-800 border border-stone-700 text-white rounded-2xl p-5 outline-none" autofocus />
            <textarea v-model="newTask.description" rows="3" placeholder="Description..." class="w-full bg-stone-800 border border-stone-700 text-white rounded-2xl p-5 outline-none resize-none"></textarea>
          </div>
          <div class="flex gap-6">
            <button @click="isTaskModalOpen = false" class="flex-1 text-stone-500 font-bold uppercase text-xs">Annuler</button>
            <button @click="creerTache" class="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-xs">Ajouter</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const taskStore = useTaskStore()
definePageMeta({ title: 'TACHES', middleware: 'auth' })
const isCatModalOpen = ref(false)
const isTaskModalOpen = ref(false)
const selectedCatId = ref<string | null>(null)
const nouveauNomCat = ref('')
const newTask = ref({ title: '', description: '' })
watch(() => authStore.user, (user) => { if (user) taskStore.refresh() }, { immediate: true })
const creerCategorie = async () => { if (nouveauNomCat.value.trim() === '') return; await taskStore.addCategory(nouveauNomCat.value); isCatModalOpen.value = false; nouveauNomCat.value = ''; }
const ouvrirModalTache = (catId: string) => { selectedCatId.value = catId; newTask.value = { title: '', description: '' }; isTaskModalOpen.value = true; }
const creerTache = async () => { if (selectedCatId.value && newTask.value.title.trim() !== '') { await taskStore.addTask(selectedCatId.value, newTask.value.title, newTask.value.description); isTaskModalOpen.value = false; newTask.value = { title: '', description: '' }; selectedCatId.value = null; } }
</script>