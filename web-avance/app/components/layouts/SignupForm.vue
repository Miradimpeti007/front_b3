<script setup lang="ts">
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';

const props = defineProps<{ avatars: any[] }>();
const emit = defineEmits(['submit']);

const schema = yup.object({
  firstName: yup.string().required('Requis'),
  lastName: yup.string().required('Requis'),
  username: yup.string().required('Requis').min(3, '3 min'),
  password: yup.string().required('Requis').min(6, '6 min'),
  householdSize: yup.number().required().min(1),
  avatar: yup.string().required('Choisissez un avatar')
});

const { handleSubmit, meta, setErrors } = useForm({ 
  validationSchema: schema,
  initialValues: { householdSize: 1, avatar: '' }
});

const { value: firstName, meta: fNameMeta } = useField<string>('firstName');
const { value: lastName, meta: lNameMeta } = useField<string>('lastName');
const { value: username, errorMessage: userError, meta: userMeta } = useField<string>('username');
const { value: password, errorMessage: passError, meta: passMeta } = useField<string>('password'); // passMeta défini ici
const { value: householdSize } = useField<number>('householdSize');
const { value: avatar, errorMessage: avatarError } = useField<string>('avatar');

defineExpose({ setServerErrors: (f: string, m: string) => setErrors({ [f]: m }) });
const onSubmit = handleSubmit((v) => emit('submit', v));
</script>

<template>
  <form @submit.prevent="onSubmit" class="space-y-6">
    <div class="grid grid-cols-2 gap-4">
      <input v-model="firstName" placeholder="Prénom" class="input-stellar" :class="{'border-red-500': fNameMeta.dirty && !fNameMeta.valid}" />
      <input v-model="lastName" placeholder="Nom" class="input-stellar" :class="{'border-red-500': lNameMeta.dirty && !lNameMeta.valid}" />
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="flex flex-col gap-1">
        <input v-model="username" placeholder="Pseudo" class="input-stellar" :class="{'border-red-500': userMeta.dirty && !userMeta.valid}" />
        <span v-if="userMeta.dirty && userError" class="text-red-500 text-[9px] font-black uppercase px-2">{{ userError }}</span>
      </div>
      <div class="flex flex-col gap-1">
        <input v-model="password" type="password" placeholder="Mot de passe" class="input-stellar" :class="{'border-red-500': passMeta.dirty && !passMeta.valid}" />
        <span v-if="passMeta.dirty && passError" class="text-red-500 text-[9px] font-black uppercase px-2">{{ passError }}</span>
      </div>
    </div>

    <div class="grid grid-cols-6 gap-3">
      <button v-for="av in avatars" :key="av.id" type="button" @click="avatar = av.url"
              class="relative aspect-square rounded-2xl overflow-hidden border-4 transition-all"
              :class="avatar === av.url ? 'border-blue-600 scale-110 shadow-lg' : 'border-transparent opacity-40'">
        <img :src="av.url" class="w-full h-full object-cover" />
      </button>
    </div>

    <button type="submit" :disabled="!meta.valid" class="w-full bg-blue-600 disabled:bg-stone-800 py-5 rounded-2xl text-white font-black uppercase text-xs tracking-widest transition-all">
      Finaliser l'inscription
    </button>
  </form>
</template>