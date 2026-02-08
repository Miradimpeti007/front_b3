<script setup lang="ts">
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';

/**
 * @file components/organisms/CategoryForm.vue
 * @description Formulaire de création de catégorie avec validation par schéma Yup.
 */

const emit = defineEmits(['submit', 'cancel']);

/**
 * Contrat de validation : le nom est obligatoire et doit faire au moins 3 caractères.
 */
const schema = yup.object({
  nom: yup.string()
    .required('Le nom est obligatoire')
    .min(3, 'Le nom doit contenir au moins 3 caractères')
});

const { handleSubmit, meta: formMeta } = useForm({ 
  validationSchema: schema 
});

/**
 * Extraction des outils de validation pour le champ "nom".
 */
const { 
  value: nom, 
  errorMessage: nomError, 
  meta: nomMeta 
} = useField<string>('nom');

const onSubmit = handleSubmit((values) => emit('submit', values.nom));
</script>

<template>
  <form @submit.prevent="onSubmit" class="space-y-8">
    <h2 class="text-2xl font-black text-white uppercase tracking-widest italic text-center">Nouvelle catégorie</h2>
    
    <div class="flex flex-col gap-2">
      <input 
        v-model="nom" 
        placeholder="Nom de la catégorie..." 
        class="w-full bg-stone-800 border-2 text-white rounded-2xl p-5 outline-none transition-all"
        :class="{ 
          'border-red-500 bg-red-500/5': nomMeta.touched && !nomMeta.valid,
          'border-stone-700 focus:border-blue-600': !nomMeta.touched || nomMeta.valid
        }"
      />
      
      <span 
        v-if="nomMeta.dirty && !nomMeta.valid" 
        class="text-red-500 text-[11px] font-black uppercase tracking-wider px-2"
      >
        {{ nomError }}
      </span>
    </div>

    <div class="flex gap-6">
      <button type="button" @click="$emit('cancel')" class="flex-1 text-stone-500 font-bold uppercase text-xs">Annuler</button>
      <button 
        type="submit" 
        :disabled="!formMeta.valid || !formMeta.dirty" 
        class="flex-1 bg-blue-600 disabled:bg-stone-800 disabled:text-stone-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all"
      >
        Confirmer
      </button>
    </div>
  </form>
</template>