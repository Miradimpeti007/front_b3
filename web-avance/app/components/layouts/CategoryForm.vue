<script setup lang="ts">
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';

/**
 * @file components/organisms/CategoryForm.vue
 * @description Formulaire de création de catégorie avec validation Yup réactive.
 */
const emit = defineEmits(['submit', 'cancel']);

const schema = yup.object({
  nom: yup.string().required('Le nom est requis').min(3, 'Minimum 3 caractères')
});

const { handleSubmit, meta: formMeta } = useForm({ validationSchema: schema });
const { value: nom, errorMessage: nomError, meta: nomMeta } = useField<string>('nom');

const onSubmit = handleSubmit((values) => emit('submit', values.nom));
</script>

<template>
  <form @submit.prevent="onSubmit" class="space-y-8">
    <h2 class="text-2xl font-black text-white uppercase tracking-widest italic text-center">Nouvelle catégorie</h2>
    <div class="flex flex-col gap-2">
      <input v-model="nom" placeholder="Nom..." class="w-full bg-stone-800 border-2 text-white rounded-2xl p-5 outline-none transition-all"
             :class="nomMeta.dirty && !nomMeta.valid ? 'border-red-500 bg-red-500/5' : 'border-stone-700'" />
      <span v-if="nomMeta.dirty && !nomMeta.valid" class="text-red-500 text-[11px] font-black uppercase tracking-wider px-2">{{ nomError }}</span>
    </div>
    <div class="flex gap-6">
      <button type="button" @click="$emit('cancel')" class="flex-1 text-stone-500 font-bold uppercase text-xs">Annuler</button>
      <button type="submit" :disabled="!formMeta.valid || !formMeta.dirty" class="flex-1 bg-blue-600 disabled:bg-stone-800 text-white py-4 rounded-2xl font-black uppercase text-xs">Confirmer</button>
    </div>
  </form>
</template>