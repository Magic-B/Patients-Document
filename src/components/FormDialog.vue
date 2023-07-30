<template lang='pug'>
q-dialog(persistent ref="dialogRef" @hide="onDialogHide")
  q-card(style='min-width: 350px')
    q-card-section
      .text-h6 Изменить документ
    q-card-section.q-pt-none
      q-select(v-model='req.document_type_name' :options='options' label='Удостоверение личности')
      q-input.q-mt-sm(dense v-model='req.pd_series' label='Серия' mask="## ## ######" autofocus)
      q-input.q-mt-sm(dense v-model='req.pd_number' label='Номер' mask="###-###")
      span {{req}}
      q-input.q-mt-sm(dense v-model='req.date_begin' mask='##.##.####' type='date')
    q-card-actions.text-primary(align='right')
      q-btn(flat label='Cancel' v-close-popup)
      q-btn(flat label='Add address' @click='createPersonalDocument' v-close-popup)
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from 'vue'
import { usePatientStore } from 'stores/patient-store'
import type { PersonalDocument } from 'src/types/patient'
import { useDialogPluginComponent } from 'quasar'

export default defineComponent({
  props: {
    document: {
      type: Object as () => PersonalDocument,
      required: true
    }
  },
  emits: [
    ...useDialogPluginComponent.emits
  ],
  setup (props) {
    const { dialogRef, onDialogHide } = useDialogPluginComponent()
    const { document } = toRefs(props)
    const patientStore = usePatientStore()
    const { createPersonalDocument } = patientStore
    const req = ref({} as PersonalDocument)
    req.value = document.value

    const options = ['Паспорт', 'Загран паспорт', 'Водительское удостоверение', 'Свидетельство рождения', 'Слово матери']

    return {
      createPersonalDocument,
      options,
      req,
      dialogRef,
      onDialogHide
    }
  }
})
</script>
