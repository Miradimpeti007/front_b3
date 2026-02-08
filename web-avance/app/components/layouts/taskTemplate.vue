<script setup lang="ts">
/**
 * @file components/templates/TaskLayout.vue
 * @description Structure structurelle pour l'agencement de la page et des modales.
 */
defineProps<{
  isCatModalOpen: boolean;
  isTaskModalOpen: boolean;
}>();

defineEmits(['close-cat', 'close-task']);
</script>

<template>
  <div class="min-h-screen bg-stone-950 p-10 flex flex-col gap-14">
    <header>
      <slot name="header-action" />
    </header>

    <main class="flex gap-10 overflow-x-auto pb-20 items-start custom-scrollbar">
      <slot />
    </main>

    <Teleport to="body">
      <div v-if="isCatModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
        <div class="bg-zinc-900 border border-white/10 w-full max-w-md rounded-[3rem] p-10 shadow-2xl">
          <slot name="modal-category" />
        </div>
      </div>

      <div v-if="isTaskModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
        <div class="bg-zinc-900 border border-white/10 w-full max-w-lg rounded-[3rem] p-10 shadow-2xl">
          <slot name="modal-task" />
        </div>
      </div>
    </Teleport>
  </div>
</template>