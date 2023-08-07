<template lang='pug'>
q-page.flex.column.items-center
  template(v-if='!loading')
    h5.text-bold {{ patient.last_name }} {{ patient.first_name }} {{ patient.middle_name }}
    template(
      v-for='document in patient.personal_documents'
      :key='document.id'
    )
      PatientCard.q-mt-lg(:document='document')
    q-btn.q-mt-lg(
      @click='openForm'
      outline
    ) Добавить документ
    FormDialog
</template>

<script lang='ts'>
import { defineComponent, onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { storeToRefs } from 'pinia'
import { usePatientStore } from 'stores/patient-store'
import PatientCard from 'components/PatientCard.vue'
import FormDialog from 'components/FormDialog.vue'
import notify from 'src/utils/util'

export default defineComponent({
  components: { FormDialog, PatientCard },
  setup () {
    const $q = useQuasar()
    const patientStore = usePatientStore()
    const { patient } = storeToRefs(patientStore)
    const { getPatientData } = patientStore
    const loading = ref(true)

    const openForm = () => {
      $q.dialog({
        component: FormDialog
      })
    }

    onMounted(async () => {
      $q.loading.show()
      try {
        await getPatientData(1)
        loading.value = false
      } catch (err) {
        notify.negative(err.message)
      } finally {
        $q.loading.hide()
      }
    })
    return {
      patient,
      loading,
      openForm
    }
  }
})
</script>
