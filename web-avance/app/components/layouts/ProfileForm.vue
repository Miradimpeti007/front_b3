<script setup lang="ts">
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';

/**
 * @file components/organisms/ProfileForm.vue
 * @description Formulaire de modification de profil avec Vee-Validate et Yup.
 */

const props = defineProps<{ initialValues: any }>();
const emit = defineEmits(['submit', 'cancel']);

const avatars = [
  { name: 'Père', path: '/avatars/pere.jpg' },
  { name: 'Mère', path: '/avatars/mere.jpg' },
  { name: 'Fils', path: '/avatars/enfant-m.jpg' },
  { name: 'Fille', path: '/avatars/enfant-f.jpg' },
  { name: 'G-Père', path: '/avatars/grand-pere.jpg' },
  { name: 'G-Mère', path: '/avatars/grand-mere.jpg' }
];

const schema = yup.object({
  username: yup.string().required("L'identifiant est requis").min(3, 'Minimum 3 caractères'),
  firstName: yup.string().required('Le prénom est requis'),
  lastName: yup.string().required('Le nom est requis'),
  householdCount: yup.number().required().min(1, 'Minimum 1 personne'),
  avatar: yup.string().required()
});

const { handleSubmit, meta: formMeta } = useForm({
  validationSchema: schema,
  initialValues: props.initialValues
});

const { value: username, errorMessage: userError } = useField<string>('username');
const { value: firstName, errorMessage: firstError } = useField<string>('firstName');
const { value: lastName, errorMessage: lastError } = useField<string>('lastName');
const { value: householdCount } = useField<number>('householdCount');
const { value: avatar } = useField<string>('avatar');

const onSubmit = handleSubmit((values) => emit('submit', values));
</script>

<template>
  <form @submit.prevent="onSubmit" class="space-y-8">
    <div class="text-center space-y-2">
      <h2 class="text-3xl font-black text-white uppercase italic tracking-tighter">Édition Matricule</h2>
      <p class="text-stone-500 text-[10px] font-bold uppercase tracking-widest">Mise à jour des paramètres système</p>
    </div>

    <div class="space-y-4">
      <p class="text-center text-[9px] font-black text-stone-600 uppercase tracking-widest italic">Choix de l'apparence</p>
      <div class="flex flex-wrap justify-center gap-4">
        <button 
          v-for="a in avatars" :key="a.path" type="button"
          @click="avatar = a.path"
          class="w-14 h-14 rounded-2xl border-2 transition-all overflow-hidden relative"
          :class="avatar === a.path ? 'border-amber-500 scale-110 shadow-lg shadow-amber-500/30' : 'border-transparent opacity-40 hover:opacity-100'"
        >
          <img :src="a.path" class="w-full h-full object-cover" />
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="flex flex-col gap-2">
        <input v-model="username" placeholder="Identifiant" class="stellar-input-field" :class="{ 'border-red-500': userError }" />
        <span v-if="userError" class="error-msg">{{ userError }}</span>
      </div>
      <div class="flex flex-col gap-2">
        <input v-model="householdCount" type="number" placeholder="Taille foyer" class="stellar-input-field" />
      </div>
      <div class="flex flex-col gap-2">
        <input v-model="firstName" placeholder="Prénom" class="stellar-input-field" :class="{ 'border-red-500': firstError }" />
        <span v-if="firstError" class="error-msg">{{ firstError }}</span>
      </div>
      <div class="flex flex-col gap-2">
        <input v-model="lastName" placeholder="Nom" class="stellar-input-field" :class="{ 'border-red-500': lastError }" />
        <span v-if="lastError" class="error-msg">{{ lastError }}</span>
      </div>
    </div>

    <div class="flex gap-4 pt-4">
      <button type="button" @click="$emit('cancel')" class="flex-1 text-stone-600 font-black uppercase text-[10px] hover:text-white transition-colors">Annuler</button>
      <button 
        type="submit" 
        :disabled="!formMeta.valid"
        class="flex-[2] bg-amber-500 disabled:bg-stone-800 disabled:text-stone-600 text-black font-black py-5 rounded-2xl uppercase text-[10px] tracking-[0.3em] shadow-xl shadow-amber-500/10"
      >
        Sauvegarder
      </button>
    </div>
  </form>
</template>

