<template>
  <div class="profile-image flex justify-center items-center">
    <img 
      :src="profileImg || '../../../defaultProfileImage.png'" 
      alt="Profile Image" 
      class="rounded-full object-cover" 
    />
  </div>
</template>
 
 <script setup lang="ts">
    let profileImg = null;
</script>