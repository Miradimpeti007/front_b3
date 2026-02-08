<template>
  <div class="min-h-screen bg-stone-950 p-8">
    <header class="mb-12">
      <slot name="action-bar" />
    </header>

    <main class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      <slot /> </main>
  </div>
</template>