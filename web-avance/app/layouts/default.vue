<template>
  <div class="flex flex-row h-screen bg-stone-800 text-white">

    <AppSideBar class="w-40 flex-none  bg-stone-900 border-r border-white/5 p-4" />

    <div class="flex-1 flex flex-col p-4">
      
      <section class="h-10 flex-none border-b border-white/5">
        <AppHeader />
      </section>

      <main class="flex-1 overflow-y-auto p-4">
        <slot />
      </main>
    </div>

  </div>
</template>