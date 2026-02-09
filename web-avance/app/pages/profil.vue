<script setup lang="ts">
/**
 * @file pages/profile.vue
 * @description Page profil orchestrant les modales et la synchronisation serveur.
 */
definePageMeta({ middleware: 'auth' });

const authStore = useAuthStore();
const router = useRouter();

const isEditModalOpen = ref(false);
const isDeleteModalOpen = ref(false);

/**
 * SYNCHRONISATION : MISE À JOUR (PUT)
 * Connecté à ton handler exporté
 */
const handleUpdate = async (formData: any) => {
  try {
    const res = await $fetch<any>('/api/user/update', { 
      method: 'PATCH', // Ton handler utilise readBody
      body: formData 
    });
    if (res.success) {
      authStore.user = res.user;
      isEditModalOpen.value = false;
    }
  } catch (e) {
    alert("Erreur de synchronisation avec la base de données.");
  }
};

/**
 * SYNCHRONISATION : SUPPRESSION (DELETE)
 * Connecté à ton handler exporté
 */
const handleDelete = async () => {
  try {
    const res = await $fetch<any>('/api/user/delete', { method: 'DELETE' });
    if (res.success) {
      authStore.user = null;
      router.push('/login');
    }
  } catch (e) {
    alert("Impossible d'effacer le matricule.");
  }
};
</script>

<template>
  <div class="flex flex-col items-center gap-12 py-10 max-w-5xl mx-auto px-6">
    
    <div class="flex flex-col items-center text-center space-y-6">
      <div class="relative group">
        <div class="w-40 h-40 rounded-full border-4 border-amber-500/30 p-1.5 bg-stone-900 shadow-[0_0_50px_rgba(245,158,11,0.15)] relative z-10">
          <img :src="authStore.user?.avatar" class="w-full h-full object-cover rounded-full" />
        </div>
        <div class="absolute -inset-4 border-2 border-dashed border-stone-800 rounded-full animate-[spin_40s_linear_infinite] pointer-events-none"></div>
      </div>

      <div class="space-y-3">
        <h1 class="text-6xl font-black text-white uppercase italic tracking-tighter leading-none">
          {{ authStore.user?.username }}
        </h1>
        <div class="flex gap-3 justify-center">
          <button @click="isEditModalOpen = true" class="px-8 py-3 bg-stone-900 border border-amber-500/20 text-amber-500 font-black text-[10px] uppercase tracking-widest rounded-full hover:bg-amber-500 hover:text-black transition-all shadow-xl">
            Modifier
          </button>
          <button @click="isDeleteModalOpen = true" class="px-8 py-3 bg-stone-900 border border-red-500/20 text-red-500 font-black text-[10px] uppercase tracking-widest rounded-full hover:bg-red-500 hover:text-white transition-all shadow-xl">
            Supprimer
          </button>
        </div>
      </div>
    </div>

    <XpStellarBar 
      v-if="authStore.user"
      :xp="authStore.user.xp" 
      :level="authStore.user.level" 
      :next-level-xp="authStore.user.nextLevelXp" 
    />

    <Teleport to="body">
      <div v-if="isEditModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div @click="isEditModalOpen = false" class="absolute inset-0 bg-black/90 backdrop-blur-xl"></div>
        <div class="relative bg-stone-900 border border-white/5 w-full max-w-xl rounded-[3rem] p-10 shadow-2xl overflow-hidden">
          <ProfileForm 
            :initial-values="{
              username: authStore.user.username,
              firstName: authStore.user.firstName,
              lastName: authStore.user.lastName,
              avatar: authStore.user.avatar,
              householdCount: authStore.user.householdCount
            }"
            @submit="handleUpdate"
            @cancel="isEditModalOpen = false"
          />
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="isDeleteModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-6">
        <div @click="isDeleteModalOpen = false" class="absolute inset-0 bg-black/90 backdrop-blur-md"></div>
        <div class="relative bg-stone-950 border border-red-500/20 w-full max-w-md rounded-[2.5rem] p-12 text-center shadow-2xl">
          <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 text-red-500 mb-6 mx-auto animate-pulse" />
          <h2 class="text-red-500 font-black uppercase text-xl italic mb-4">Alerte Critique</h2>
          <p class="text-stone-600 text-[9px] font-bold uppercase tracking-widest mb-10 leading-relaxed italic">Cette action est irréversible. Toutes les archives de données seront perdues.</p>
          <div class="flex flex-col gap-3">
            <button @click="handleDelete" class="w-full bg-red-600 text-white font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest hover:bg-red-500">Confirmer Destruction</button>
            <button @click="isDeleteModalOpen = false" class="w-full bg-stone-800 text-stone-500 font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest hover:text-white">Abandonner</button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>