<template lang='pug'>
q-page.flex.column.items-center
  h5 {{ patient.last_name }} {{ patient.first_name }} {{ patient.middle_name }}
  template(v-for='document in patient.personal_documents' :key='document.id')
    PatientCard(:document='document')
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { usePatientStore } from 'stores/patient-store'
import PatientCard from 'components/PatientCard.vue'

export default defineComponent({
  components: { PatientCard },
  setup () {
    const patientStore = usePatientStore()
    const { patient } = storeToRefs(patientStore)
    return {
      patient
    }
  }
})
</script>
