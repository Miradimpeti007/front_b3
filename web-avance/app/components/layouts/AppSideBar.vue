<template>
  <aside class="flex flex-col bg-stone-900 border border-white/5 rounded-[2.5rem] p-8 shadow-2xl h-full overflow-hidden">
    
    <NuxtLink to="/profil" class="flex flex-col items-center gap-5 mb-10 pb-8 border-b border-white/5 cursor-pointer no-underline decoration-transparent">
      <div class="relative">
        <div class="w-24 h-24 rounded-full p-1.5 border-2 border-stone-800 bg-stone-900 shadow-2xl overflow-hidden flex justify-center items-center">
          <img 
            :src="authStore.user?.avatar || '/defaultProfileImage.png'" 
            alt="Profil" 
            class="w-full h-full rounded-full object-cover border border-white/10" 
          />
        </div>
      </div>

      <div class="w-full text-center flex flex-col items-center gap-4">
        <div class="flex items-center gap-3">
          <h3 class="text-[13px] font-black uppercase tracking-[0.2em] text-white">
            {{ authStore.user?.username || 'Utilisateur' }}
          </h3>
          <div class="flex items-center gap-1.5 px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-md">
            <span class="text-[9px] font-black text-amber-500 uppercase">LVL {{ authStore.user?.level || 1 }}</span>
          </div>
        </div>

        <div class="w-full max-w-[160px] space-y-2">
          <div class="flex justify-between items-center px-1">
            <span class="text-[9px] font-black text-stone-500 uppercase tracking-widest">Expérience</span>
            <span class="text-[9px] font-bold text-amber-500/80">
              {{ authStore.user?.xp || 0 }} / {{ authStore.user?.xpNext || 1000 }} XP
            </span>
          </div>
          <div class="h-1.5 w-full bg-stone-800 rounded-full overflow-hidden border border-white/5 shadow-inner">
            <div 
              class="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-1000"
              :style="{ width: `${((authStore.user?.xp || 0) / (authStore.user?.xpNext || 1000)) * 100}%` }"
            ></div>
          </div>
        </div>
      </div>
    </NuxtLink>

    <nav class="flex-1 flex flex-col gap-3">
      <AppSideBarItem to="/" label="Accueil" />
      <AppSideBarItem to="/taches" label="Tâches" />
      <AppSideBarItem to="/factures" label="Factures" />
    </nav>

    <button @click="authStore.logout()" class="mt-auto group flex items-center justify-center gap-3 px-6 py-4 bg-stone-800/30 hover:bg-red-950/20 border border-white/5 rounded-2xl transition-all duration-500">
      <span class="text-[10px] uppercase font-black tracking-[0.3em] text-stone-500 group-hover:text-red-400">Déconnexion</span>
    </button>
  </aside>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
</script>