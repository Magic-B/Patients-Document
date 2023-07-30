<template lang='pug'>
q-card(style='width: 300px')
  q-card-section.relative-position.flex.column.items-center
    q-icon.absolute.absolute-right.q-mt-sm.q-mr-sm.cursor-pointer(name="edit" size='22px' @click='openForm')
    div {{ document.document_type_name }}
    .q-mt-lg
      .flex
        .q-mr-lg
          div №
          div Серия:
          div Дата выдачи:
        div
          div {{ document.pd_number }}
          div {{ document.pd_series }}
          div {{ document.date_begin }}
      .flex.q-mt-lg
        .q-mr-sm {{ document.files.length ? 'Скан копия загружена' : 'Скан копия не загружена'}}
        q-icon(:name="document.files.length ? 'task' : 'note_add'" size='22px')
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from 'vue'
import type { PersonalDocument } from 'src/types/patient'
import FormDialog from 'components/FormDialog.vue'
import { useQuasar } from 'quasar'

export default defineComponent({
  props: {
    document: {
      type: Object as () => PersonalDocument,
      required: true
    }
  },
  setup (props) {
    const { document } = toRefs(props)
    const show = ref(false)

    const $q = useQuasar()
    const openForm = () => {
      $q.dialog({
        component: FormDialog,
        componentProps: {
          document
        }
      })
    }
    return {
      show,
      openForm
    }
  }
})
</script>
