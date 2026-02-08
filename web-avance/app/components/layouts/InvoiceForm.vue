<script setup lang="ts">
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';

/**
 * @file components/organisms/InvoiceForm.vue
 * @description Formulaire validé supportant l'injection de données aléatoires.
 */
const props = defineProps<{ initialValues?: any, isEditing: boolean }>();
const emit = defineEmits(['submit', 'cancel']);

const schema = yup.object({
  prestataire: yup.string().required('Nom requis'),
  categorie: yup.string().required('Catégorie requise'),
  montant: yup.number().required('Montant requis').moreThan(0, 'Invalide'),
  dateEmission: yup.string().required('Requis'),
  dateEcheance: yup.string().required('Requis')
});

const { handleSubmit, meta, setValues, resetForm } = useForm({ 
  validationSchema: schema,
  initialValues: props.initialValues
});

const { value: prestataire, errorMessage: pErr, meta: pMeta } = useField<string>('prestataire');
const { value: categorie, errorMessage: cErr, meta: cMeta } = useField<string>('categorie');
const { value: montant, errorMessage: mErr, meta: mMeta } = useField<number>('montant');
const { value: dateEmission } = useField<string>('dateEmission');
const { value: dateEcheance, errorMessage: eErr, meta: eMeta } = useField<string>('dateEcheance');

// Surveillance des props pour le "Random Filling"
watch(() => props.initialValues, (newVals) => {
  if (newVals) {
    setValues(newVals);
  } else {
    resetForm();
  }
}, { deep: true, immediate: true });

const onSubmit = handleSubmit((values) => emit('submit', values));
</script>

<template>
  <form @submit.prevent="onSubmit" class="space-y-6">
    <h2 class="text-xl font-black text-white uppercase tracking-widest text-center border-b border-white/5 pb-4 italic">
      {{ isEditing ? 'Édition Stellaire' : 'Nouvelle Charge' }}
    </h2>
    
    <div class="grid grid-cols-2 gap-4">
      <div class="flex flex-col gap-1">
        <input v-model="prestataire" placeholder="PRESTATAIRE" class="input-stellar" 
               :class="{'border-red-500 bg-red-500/5': pMeta.dirty && !pMeta.valid}" />
        <span v-if="pMeta.dirty && pErr" class="text-[9px] text-red-500 font-black uppercase px-2">{{ pErr }}</span>
      </div>
      <div class="flex flex-col gap-1">
        <input v-model="categorie" placeholder="CATÉGORIE" class="input-stellar" 
               :class="{'border-red-500 bg-red-500/5': cMeta.dirty && !cMeta.valid}" />
        <span v-if="cMeta.dirty && cErr" class="text-[9px] text-red-500 font-black uppercase px-2">{{ cErr }}</span>
      </div>
    </div>

    <div class="flex flex-col gap-1">
      <input v-model="montant" type="number" step="0.01" placeholder="MONTANT (€)" class="input-stellar" 
             :class="{'border-red-500 bg-red-500/5': mMeta.dirty && !mMeta.valid}" />
      <span v-if="mMeta.dirty && mErr" class="text-[9px] text-red-500 font-black uppercase px-2">{{ mErr }}</span>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="space-y-1">
        <p class="text-[9px] font-black text-stone-600 uppercase ml-2">Émission</p>
        <input v-model="dateEmission" type="date" class="input-stellar" />
      </div>
      <div class="space-y-1">
        <p class="text-[9px] font-black text-stone-600 uppercase ml-2">Échéance</p>
        <input v-model="dateEcheance" type="date" class="input-stellar" 
               :class="{'border-red-500 bg-red-500/5': eMeta.dirty && !eMeta.valid}" />
        <span v-if="eMeta.dirty && eErr" class="text-[9px] text-red-500 font-black uppercase px-2">{{ eErr }}</span>
      </div>
    </div>

    <div class="flex gap-4 pt-4">
      <button type="button" @click="$emit('cancel')" class="flex-1 text-stone-500 font-black uppercase text-[10px]">Annuler</button>
      <button type="submit" :disabled="!meta.valid" class="flex-2 bg-blue-600 disabled:bg-stone-800 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-600/20">
        {{ isEditing ? 'Mettre à jour' : 'Enregistrer' }}
      </button>
    </div>
  </form>
</template>