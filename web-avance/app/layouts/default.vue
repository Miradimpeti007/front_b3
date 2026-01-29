<template>
  <div class="flex flex-row h-screen bg-stone-800 text-white font-sans p-8 gap-8 overflow-hidden">
    <AppSideBar class="w-72 flex-none" />

    <div class="flex-1 flex flex-col gap-8 overflow-hidden">
      <AppHeader class="flex-none" />

      <main class="flex-1 overflow-y-auto rounded-[2.5rem] bg-stone-900/40 border border-white/5 p-10 shadow-inner backdrop-blur-sm">
        <slot />
      </main>
    </div>
  </div>
</template>