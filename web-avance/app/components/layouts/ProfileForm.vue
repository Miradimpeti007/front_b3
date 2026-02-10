<script setup lang="ts">
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';

const props = defineProps<{ initialValues: any }>();
const emit = defineEmits(['submit', 'cancel']);

const avatars = [
  { name: 'Père', path: '/avatars/pere.jpg' }, { name: 'Mère', path: '/avatars/mere.jpg' },
  { name: 'Fils', path: '/avatars/enfant-m.jpg' }, { name: 'Fille', path: '/avatars/enfant-f.jpg' },
  { name: 'G-Père', path: '/avatars/grand-pere.jpg' }, { name: 'G-Mère', path: '/avatars/grand-mere.jpg' }
];

// SCHEMA : Doit utiliser householdSize pour matcher le serveur
const schema = yup.object({
  username: yup.string().required("Requis"),
  firstName: yup.string().required("Requis"),
  lastName: yup.string().required("Requis"),
  householdSize: yup.number().required().min(1),
  avatar: yup.string().required()
});

const { handleSubmit, meta: formMeta } = useForm({
  validationSchema: schema,
  initialValues: props.initialValues
});

const { value: username } = useField<string>('username');
const { value: firstName } = useField<string>('firstName');
const { value: lastName } = useField<string>('lastName');
const { value: householdSize } = useField<number>('householdSize'); // Clé exacte
const { value: avatar } = useField<string>('avatar');

const onSubmit = handleSubmit((values) => emit('submit', values));

const inputBase = "w-full bg-stone-950 border border-white/5 text-white rounded-2xl p-4 text-[10px] font-black uppercase tracking-widest focus:border-amber-500/40 outline-none transition-all placeholder:text-stone-800";
</script>

<template>
  <form @submit.prevent="onSubmit" class="flex flex-col gap-8">
    <div class="text-center">
      <h2 class="text-3xl font-black text-white uppercase italic tracking-tighter">Édition Matricule</h2>
    </div>

    <div class="flex flex-wrap justify-center gap-3">
      <button v-for="a in avatars" :key="a.path" type="button" @click="avatar = a.path"
        class="w-14 h-14 rounded-2xl border-2 transition-all overflow-hidden"
        :class="avatar === a.path ? 'border-amber-500 scale-110' : 'border-transparent opacity-40'">
        <img :src="a.path" class="w-full h-full object-cover" />
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="flex flex-col gap-1.5">
        <label class="text-[8px] font-black text-stone-600 uppercase ml-4">Identifiant</label>
        <input v-model="username" type="text" :class="inputBase" />
      </div>
      <div class="flex flex-col gap-1.5">
        <label class="text-[8px] font-black text-stone-600 uppercase ml-4">Membres Foyer</label>
        <input v-model="householdSize" type="number" :class="inputBase" />
      </div>
      <div class="flex flex-col gap-1.5">
        <label class="text-[8px] font-black text-stone-600 uppercase ml-4">Prénom</label>
        <input v-model="firstName" type="text" :class="inputBase" />
      </div>
      <div class="flex flex-col gap-1.5">
        <label class="text-[8px] font-black text-stone-600 uppercase ml-4">Nom</label>
        <input v-model="lastName" type="text" :class="inputBase" />
      </div>
    </div>

    <div class="flex gap-4 pt-4">
      <button type="button" @click="$emit('cancel')" class="flex-1 text-stone-600 font-black uppercase text-[10px]">Annuler</button>
      <button type="submit" :disabled="!formMeta.valid" class="flex-[2] py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] transition-all bg-amber-500 text-black shadow-xl shadow-amber-500/10">
        Sauvegarder
      </button>
    </div>
  </form>
</template>