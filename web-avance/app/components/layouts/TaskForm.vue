<script setup lang="ts">
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';

/**
 * @file components/organisms/TaskForm.vue
 * @description Formulaire de création de tâche avec gestion des erreurs Yup par champ.
 */

const emit = defineEmits(['submit', 'cancel']);

const schema = yup.object({
  title: yup.string()
    .required('Un titre est requis pour créer une tâche')
    .min(2, 'Le titre est trop court (min 2)'),
  description: yup.string()
});

const { handleSubmit, meta: formMeta } = useForm({ 
  validationSchema: schema 
});

const { 
  value: title, 
  errorMessage: titleError, 
  meta: titleMeta 
} = useField<string>('title');

const { value: description } = useField<string>('description');

const onSubmit = handleSubmit((values) => emit('submit', values));
</script>

<template>
  <form @submit.prevent="onSubmit" class="space-y-6">
    <h2 class="text-2xl font-black text-white uppercase italic tracking-widest text-center">Nouvelle tâche</h2>
    
    <div class="space-y-4">
      <div class="flex flex-col gap-2">
        <input 
          v-model="title" 
          placeholder="Titre de la tâche..." 
          class="w-full bg-stone-800 border-2 text-white rounded-2xl p-5 outline-none transition-all"
          :class="{ 'border-red-500 bg-red-500/5': titleMeta.touched && !titleMeta.valid }"
        />
        <span 
          v-if="titleMeta.dirty && !titleMeta.valid" 
          class="text-red-500 text-[11px] font-black uppercase tracking-wider px-2"
        >
          {{ titleError }}
        </span>
      </div>

      <textarea 
        v-model="description" 
        placeholder="Description..." 
        rows="3"
        class="w-full bg-stone-800 border-2 border-stone-700 text-white rounded-2xl p-5 outline-none resize-none focus:border-blue-600 transition-all"
      ></textarea>
    </div>

    <div class="flex gap-6">
      <button type="button" @click="$emit('cancel')" class="flex-1 text-stone-500 font-bold uppercase text-xs">Annuler</button>
      <button 
        type="submit" 
        :disabled="!formMeta.valid || !formMeta.dirty" 
        class="flex-1 bg-blue-600 disabled:bg-stone-800 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest"
      >
        Ajouter
      </button>
    </div>
  </form>
</template>