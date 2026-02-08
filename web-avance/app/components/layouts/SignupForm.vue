<script setup lang="ts">
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';

/**
 * @file components/organisms/SignupForm.vue
 * @description Organisme gérant l'inscription avec validation stricte et retours d'erreurs.
 */

const props = defineProps<{ avatars: any[] }>();
const emit = defineEmits(['submit']);

/**
 * Schéma de validation Yup. Chaque champ est obligatoire.
 */
const schema = yup.object({
  firstName: yup.string().required('Le prénom est obligatoire'),
  lastName: yup.string().required('Le nom est obligatoire'),
  username: yup.string().required('Le pseudo est obligatoire').min(3, '3 caractères minimum'),
  password: yup.string().required('Le mot de passe est obligatoire').min(4, '4 caractères minimum'),
  householdSize: yup.number().required().min(1),
  avatar: yup.string().required('Vous devez choisir un personnage')
});

const { handleSubmit, meta, setErrors } = useForm({ 
  validationSchema: schema,
  initialValues: { householdSize: 1, avatar: '' }
});

const { value: firstName, errorMessage: fNameError, meta: fNameMeta } = useField<string>('firstName');
const { value: lastName, errorMessage: lNameError, meta: lNameMeta } = useField<string>('lastName');
const { value: username, errorMessage: userError, meta: userMeta } = useField<string>('username');
const { value: password, errorMessage: passError, meta: passMeta } = useField<string>('password');
const { value: householdSize } = useField<number>('householdSize');
const { value: avatar, errorMessage: avatarError, meta: avatarMeta } = useField<string>('avatar');

/**
 * Expose la méthode pour injecter les erreurs serveur (ex: utilisateur déjà existant).
 */
const setServerErrors = (field: string, message: string) => {
  setErrors({ [field]: message });
};

defineExpose({ setServerErrors });

const onSubmit = handleSubmit((values) => emit('submit', values));
</script>

<template>
  <form @submit.prevent="onSubmit" class="space-y-6">
    
    <div class="grid grid-cols-2 gap-4">
      <div class="flex flex-col gap-2">
        <label class="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-2">Prénom</label>
        <input v-model="firstName" class="w-full bg-stone-800 border-2 rounded-2xl p-4 text-white outline-none transition-all"
               :class="{ 'border-red-500 bg-red-500/5': fNameMeta.dirty && !fNameMeta.valid, 'border-stone-700': !fNameMeta.dirty || fNameMeta.valid }" />
        <span v-if="fNameMeta.dirty && fNameError" class="text-red-500 text-[10px] font-black uppercase px-2">{{ fNameError }}</span>
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-2">Nom</label>
        <input v-model="lastName" class="w-full bg-stone-800 border-2 rounded-2xl p-4 text-white outline-none transition-all"
               :class="{ 'border-red-500 bg-red-500/5': lNameMeta.dirty && !lNameMeta.valid, 'border-stone-700': !lNameMeta.dirty || lNameMeta.valid }" />
        <span v-if="lNameMeta.dirty && lNameError" class="text-red-500 text-[10px] font-black uppercase px-2">{{ lNameError }}</span>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="flex flex-col gap-2">
        <label class="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-2">Pseudo</label>
        <input v-model="username" class="w-full bg-stone-800 border-2 rounded-2xl p-4 text-white outline-none transition-all"
               :class="{ 'border-red-500 bg-red-500/5': userError || (userMeta.dirty && !userMeta.valid), 'border-stone-700': !userError }" />
        <span v-if="userError" class="text-red-500 text-[10px] font-black uppercase px-2">{{ userError }}</span>
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-2">Mot de passe</label>
        <input v-model="password" type="password" class="w-full bg-stone-800 border-2 rounded-2xl p-4 text-white outline-none transition-all"
               :class="{ 'border-red-500 bg-red-500/5': passError || (passMeta.dirty && !passMeta.valid), 'border-stone-700': !passError }" />
        <span v-if="passError" class="text-red-500 text-[10px] font-black uppercase px-2">{{ passError }}</span>
      </div>
    </div>

    <div class="flex flex-col gap-3">
      <label class="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-2">Membres du foyer</label>
      <div class="flex items-center gap-4 bg-stone-800 border-2 border-stone-700 rounded-2xl p-2">
        <button type="button" @click="householdSize = Math.max(1, householdSize - 1)" class="w-12 h-12 bg-stone-700 rounded-xl text-white font-bold text-xl">-</button>
        <span class="flex-1 text-center text-xl font-black text-white">{{ householdSize }}</span>
        <button type="button" @click="householdSize++" class="w-12 h-12 bg-stone-700 rounded-xl text-white font-bold text-xl">+</button>
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <div class="flex justify-between items-end px-2">
        <label class="text-[10px] font-black text-stone-500 uppercase tracking-widest">Choisir un personnage</label>
        <span v-if="avatarError" class="text-red-500 text-[10px] font-black uppercase italic">{{ avatarError }}</span>
      </div>
      <div class="grid grid-cols-6 gap-3">
        <button v-for="av in avatars" :key="av.id" type="button" @click="avatar = av.url"
                class="relative aspect-square rounded-2xl overflow-hidden border-4 transition-all"
                :class="avatar === av.url ? 'border-blue-600 scale-110 shadow-lg shadow-blue-600/20' : 'border-transparent opacity-40 hover:opacity-100'">
          <img :src="av.url" class="w-full h-full object-cover" />
          <div v-if="avatar === av.url" class="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
             <UIcon name="i-heroicons-check-circle-20-solid" class="text-white w-6 h-6" />
          </div>
        </button>
      </div>
    </div>

    <button type="submit" :disabled="!meta.valid" class="w-full bg-blue-600 disabled:bg-stone-800 disabled:text-stone-600 py-5 rounded-2xl text-white font-black uppercase tracking-widest shadow-xl transition-all active:scale-95">
      {{ meta.valid ? 'Finaliser l\'inscription' : 'Remplir tous les champs' }}
    </button>
  </form>
</template>