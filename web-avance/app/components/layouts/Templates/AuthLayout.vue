<template>
  <div class="min-h-screen bg-black flex items-center justify-center p-4">
    <div class="w-full max-w-2xl bg-zinc-900 border border-white/5 rounded-[3rem] p-10 shadow-2xl">
      <header class="text-center mb-10">
        <h1 class="text-4xl font-black text-white uppercase tracking-tighter italic italic">
          <slot name="title" />
        </h1>
        <p class="text-stone-500 font-bold mt-3 tracking-wide">
          <slot name="subtitle" />
        </p>
      </header>

      <main>
        <slot />
      </main>

      <footer class="mt-10 text-center">
        <slot name="footer" />
      </footer>
    </div>
  </div>
</template>