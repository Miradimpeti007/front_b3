<script setup lang="ts">
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';

/**
 * @file components/organisms/ProfileForm.vue
 * @description Formulaire de matricule avec validation stricte et sélecteur d'avatars.
 */

const props = defineProps<{ initialValues: any }>();
const emit = defineEmits(['submit', 'cancel']);

// Liste précise des avatars selon tes fichiers
const avatars = [
  { name: 'Père', path: '/avatars/pere.jpg' },
  { name: 'Mère', path: '/avatars/mere.jpg' },
  { name: 'Fils', path: '/avatars/enfant-m.jpg' },
  { name: 'Fille', path: '/avatars/enfant-f.jpg' },
  { name: 'G-Père', path: '/avatars/grand-pere.jpg' },
  { name: 'G-Mère', path: '/avatars/grand-mere.jpg' }
];

const schema = yup.object({
  username: yup.string().required("Identifiant requis").min(3, '3 caractères min'),
  firstName: yup.string().required('Prénom requis'),
  lastName: yup.string().required('Nom requis'),
  householdCount: yup.number().required().min(1),
  avatar: yup.string().required()
});

const { handleSubmit, meta: formMeta } = useForm({
  validationSchema: schema,
  initialValues: props.initialValues
});

const { value: username, errorMessage: userErr } = useField<string>('username');
const { value: firstName, errorMessage: firstErr } = useField<string>('firstName');
const { value: lastName, errorMessage: lastErr } = useField<string>('lastName');
const { value: householdCount } = useField<number>('householdCount');
const { value: avatar } = useField<string>('avatar');

const onSubmit = handleSubmit((values) => emit('submit', values));

// Classe utilitaire pour éviter l'erreur de build
const inputBase = "w-full bg-stone-950 border border-white/5 text-white rounded-2xl p-4 text-[10px] font-black uppercase tracking-widest focus:border-amber-500/40 outline-none transition-all placeholder:text-stone-800";
</script>

<template>
  <form @submit.prevent="onSubmit" class="flex flex-col gap-8">
    <div class="text-center">
      <h2 class="text-3xl font-black text-white uppercase italic tracking-tighter">Édition Matricule</h2>
      <p class="text-stone-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">Mise à jour des paramètres système</p>
    </div>

    <div class="flex flex-col gap-4">
      <p class="text-center text-[9px] font-black text-stone-600 uppercase tracking-widest italic">Choix de l'apparence</p>
      <div class="flex flex-wrap justify-center gap-3">
        <button 
          v-for="a in avatars" :key="a.path" type="button"
          @click="avatar = a.path"
          class="w-14 h-14 rounded-2xl border-2 transition-all overflow-hidden relative"
          :class="avatar === a.path ? 'border-amber-500 scale-110 shadow-lg shadow-amber-500/30' : 'border-transparent opacity-40 hover:opacity-100'"
        >
          <img :src="a.path" class="w-full h-full object-cover" />
          <div v-if="avatar === a.path" class="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
            <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-white" />
          </div>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="flex flex-col gap-1.5">
        <label class="text-[8px] font-black text-stone-600 uppercase ml-4">Identifiant</label>
        <input v-model="username" type="text" :class="[inputBase, { 'border-red-500/50': userErr }]" />
      </div>
      <div class="flex flex-col gap-1.5">
        <label class="text-[8px] font-black text-stone-600 uppercase ml-4">Membres Foyer</label>
        <input v-model="householdCount" type="number" :class="inputBase" />
      </div>
      <div class="flex flex-col gap-1.5">
        <label class="text-[8px] font-black text-stone-600 uppercase ml-4">Prénom</label>
        <input v-model="firstName" type="text" :class="[inputBase, { 'border-red-500/50': firstErr }]" />
      </div>
      <div class="flex flex-col gap-1.5">
        <label class="text-[8px] font-black text-stone-600 uppercase ml-4">Nom</label>
        <input v-model="lastName" type="text" :class="[inputBase, { 'border-red-500/50': lastErr }]" />
      </div>
    </div>

    <div class="flex gap-4 pt-4">
      <button type="button" @click="$emit('cancel')" class="flex-1 text-stone-600 font-black uppercase text-[10px] hover:text-white transition-colors">Annuler</button>
      <button 
        type="submit" 
        :disabled="!formMeta.valid"
        class="flex-[2] py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] transition-all"
        :class="formMeta.valid ? 'bg-amber-500 text-black shadow-xl shadow-amber-500/10 hover:bg-yellow-400' : 'bg-stone-800 text-stone-600 cursor-not-allowed'"
      >
        Sauvegarder
      </button>
    </div>
  </form>
</template>