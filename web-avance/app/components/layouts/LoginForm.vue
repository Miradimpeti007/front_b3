<script setup lang="ts">
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';

/**
 * @file components/organisms/LoginForm.vue
 * @description Formulaire d'authentification avec gestion des erreurs synchrones et asynchrones.
 */

const emit = defineEmits(['submit']);

/**
 * Schéma de validation client pour le formatage.
 */
const schema = yup.object({
  username: yup.string().required('Le pseudo est obligatoire'),
  password: yup.string().required('Le mot de passe est obligatoire')
});

const { handleSubmit, meta, setErrors } = useForm({ 
  validationSchema: schema 
});

const { 
  value: username, 
  errorMessage: userError, 
  meta: userMeta 
} = useField<string>('username');

const { 
  value: password, 
  errorMessage: passError, 
  meta: passMeta 
} = useField<string>('password');

/**
 * Méthode exposée pour injecter des erreurs provenant de l'API.
 */
const setServerErrors = (message: string) => {
  setErrors({
    username: message,
    password: message
  });
};

defineExpose({ setServerErrors });

const onSubmit = handleSubmit((values) => emit('submit', values));
</script>

<template>
  <form @submit.prevent="onSubmit" class="space-y-6">
    <div class="flex flex-col gap-2">
      <label class="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-2">Identifiant</label>
      <input 
        v-model="username" 
        type="text" 
        placeholder="Pseudo" 
        class="w-full bg-stone-800 border-2 rounded-2xl p-5 text-white outline-none transition-all"
        :class="{
          'border-red-500 bg-red-500/5': userError || (userMeta.dirty && !userMeta.valid),
          'border-stone-700 focus:border-blue-600': !userError && (!userMeta.dirty || userMeta.valid)
        }"
      />
      <span v-if="userError" class="text-red-500 text-[10px] font-black uppercase px-2">
        {{ userError }}
      </span>
    </div>

    <div class="flex flex-col gap-2">
      <label class="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-2">Mot de passe</label>
      <input 
        v-model="password" 
        type="password" 
        placeholder="••••••••" 
        class="w-full bg-stone-800 border-2 rounded-2xl p-5 text-white outline-none transition-all"
        :class="{
          'border-red-500 bg-red-500/5': passError || (passMeta.dirty && !passMeta.valid),
          'border-stone-700 focus:border-blue-600': !passError && (!passMeta.dirty || passMeta.valid)
        }"
      />
      <span v-if="passError" class="text-red-500 text-[10px] font-black uppercase px-2">
        {{ passError }}
      </span>
    </div>

    <button 
      type="submit" 
      :disabled="!meta.valid" 
      class="w-full bg-blue-600 disabled:bg-stone-800 py-5 rounded-2xl text-white font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 active:scale-95 transition-all"
    >
      Se connecter
    </button>
  </form>
</template>