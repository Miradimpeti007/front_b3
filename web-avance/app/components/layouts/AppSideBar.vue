<template>
    <div class="sidebar">
        <AppProfileImage class="w-25 h-25 mx-auto mb-15"/>
        <ul class="list-none">
            <AppSideBarItem v-for="(item, index) in sideItem" :key="`sideItem-${index}`" :title="item.title" :url="item.url" />
        </ul>
    </div>
</template>

<script setup lang="ts">
    import { sideItem } from '../data/SideBarItem'
</script>