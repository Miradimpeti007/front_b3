 <<template>
    <li v-if="url">
        <NuxtLink :to="url" >{{title}}</NuxtLink>
    </li> 
 </template>
 
 <script setup lang="ts">

    const props= defineProps({
        title: {
            type: String,
            required: true,
            default: ''
        },
        url: {
            type: String,
            required: false,
            default: ''
        }
    })

 </script>
 