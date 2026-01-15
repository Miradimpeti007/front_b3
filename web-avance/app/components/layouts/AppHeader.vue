<template >
    <div>
       <h2>{{ props.title }}</h2> 
    </div>
</template>

<script setup lang="ts">    
    const props= defineProps({
        title: {
            type: String,
            required: false,
            default: 'title'
        }
    })
</script>