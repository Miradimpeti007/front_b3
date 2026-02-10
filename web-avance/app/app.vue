
<script setup lang="ts">
const authStore = useAuthStore();

// Si l'utilisateur devient null (à cause d'une 401), on dégage immédiatement au login
watch(() => authStore.user, (newUser) => {
  if (!newUser) {
    navigateTo('/login');
  }
});
</script>

<template>
  <div>
    <NuxtLoadingIndicator color="#3b82f6" :height="5" />
    
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ClientOnly>
      <UNotifications />
    </ClientOnly>
  </div>
</template>