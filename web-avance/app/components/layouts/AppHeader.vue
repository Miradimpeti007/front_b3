<template>
  <div class="bg-stone-900/80 border border-white/5 rounded-[2rem] px-10 py-7 flex items-center justify-between shadow-2xl backdrop-blur-md">
    <h2 class="uppercase tracking-[0.4em] font-black text-sm text-stone-400">
      {{ $route.meta.title || 'Dashboard' }}
    </h2>

    <div class="flex items-center gap-4 px-5 py-2.5 bg-stone-800/40 rounded-full border border-white/5">
      <div class="relative flex h-2.5 w-2.5">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.8)]"></span>
      </div>
      <span class="text-[10px] uppercase tracking-[0.2em] font-black text-stone-200">
        En ligne
      </span>
    </div>
  </div>
</template>