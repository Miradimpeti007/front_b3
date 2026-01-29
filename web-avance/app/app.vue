
<script setup lang="ts">
  
  
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