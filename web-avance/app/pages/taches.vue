<template>
  <div class="p-6 min-h-screen">
    <section 
      @click="isCatModalOpen = true"
      class="mb-10 cursor-pointer border border-white/10 rounded-2xl p-6 hover:bg-stone-900 transition-all group max-w-sm"
    >
      <div class="flex items-center gap-4">
        <img src="../../../Add_task_icone.png" alt="Add" class="w-8 h-8 group-hover:scale-110 transition-transform"/>
        <p class="text-stone-400 group-hover:text-white font-bold tracking-wide">Ajouter une catégorie</p>
      </div>
    </section>

    <section class="flex flex-wrap gap-6 items-start">
      <TaskCategory 
        v-for="cat in taskStore.categories" 
        :key="cat.id" 
        :id="cat.id"
        :title="cat.nom"
        :tasks="cat.tasks"
        @add-task="ouvrirModalTache(cat.id)"
        @delete-category="taskStore.removeCategory"
        @toggle-task="taskStore.toggleTaskStatus"
        @delete-task="taskStore.removeTask"
      />
    </section>

    <Teleport to="body">
      <div v-if="isCatModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div @click="isCatModalOpen = false" class="absolute inset-0 bg-black/60 backdrop-blur-md"></div>
        <div class="relative bg-zinc-900 border border-white/10 w-full max-w-md rounded-3xl p-8 shadow-2xl">
          <h2 class="text-2xl font-black text-white mb-6">Nouvelle catégorie</h2>
          <input v-model="nouveauNomCat" @keyup.enter="creerCategorie" type="text" placeholder="Nom..." class="w-full bg-stone-800 border border-stone-700 text-white rounded-xl p-4 mb-8 outline-none focus:border-blue-500" autofocus />
          <div class="flex gap-4">
            <button @click="isCatModalOpen = false" class="flex-1 text-stone-400 font-bold">Annuler</button>
            <button @click="creerCategorie" class="flex-1 bg-blue-600 text-white py-3 rounded-2xl font-black">CONFIRMER</button>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="isTaskModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div @click="isTaskModalOpen = false" class="absolute inset-0 bg-black/60 backdrop-blur-md"></div>
        <div class="relative bg-zinc-900 border border-white/10 w-full max-w-lg rounded-3xl p-8 shadow-2xl">
          <h2 class="text-2xl font-black text-white mb-6">Nouvelle tâche</h2>
          <div class="space-y-4 mb-8">
            <input v-model="newTask.title" type="text" placeholder="Titre" class="w-full bg-stone-800 border border-stone-700 text-white rounded-xl p-4 outline-none focus:border-blue-500" autofocus />
            <textarea v-model="newTask.description" rows="3" placeholder="Description" class="w-full bg-stone-800 border border-stone-700 text-white rounded-xl p-4 outline-none focus:border-blue-500 resize-none"></textarea>
          </div>
          <div class="flex gap-4">
            <button @click="isTaskModalOpen = false" class="flex-1 text-stone-400 font-bold">Annuler</button>
            <button @click="creerTache" class="flex-1 bg-blue-600 text-white py-3 rounded-2xl font-black">AJOUTER</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const taskStore = useTaskStore() // Rappel : bien vérifier le 'u' minuscule

definePageMeta({ title: 'TACHES' })

const isCatModalOpen = ref(false)
const isTaskModalOpen = ref(false)
const selectedCatId = ref<string | null>(null)
const nouveauNomCat = ref('')
const newTask = ref({ title: '', description: '' })

onMounted(() => {
  taskStore.refresh()
})

const creerCategorie = async () => {
  if (nouveauNomCat.value.trim() === '') return
  await taskStore.addCategory(nouveauNomCat.value)
  isCatModalOpen.value = false
  nouveauNomCat.value = ''
}

const ouvrirModalTache = (catId: string) => {
  selectedCatId.value = catId
  newTask.value = { title: '', description: '' }
  isTaskModalOpen.value = true
}

const creerTache = async () => {
  if (selectedCatId.value && newTask.value.title.trim() !== '') {
    await taskStore.addTask(selectedCatId.value, newTask.value.title, newTask.value.description)
    isTaskModalOpen.value = false
    newTask.value = { title: '', description: '' }
  }
}
</script>