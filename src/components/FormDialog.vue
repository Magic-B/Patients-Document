<template lang='pug'>
q-dialog(persistent ref='dialogRef' @hide='onDialogHide')
  q-card(style='min-width: 350px')
    q-card-section
      .text-h6 Изменить документ
    q-card-section.q-pt-none
      q-form(
        ref='formRef'
        @submit.prevent.stop='onSubmit'
      )
        q-select(
          rounded
          outlined
          v-model='req.document_type_name'
          :rules='[val => !!val || "Выберите тип докумнета"]'
          lazy-rules :options='options'
          label='Удостоверение личности'
        )
        q-input(rounded
          outlined
          v-model='req.pd_series'
          label='Серия'
          mask='## ## ######'
        )
        q-input.q-mt-md(rounded
          outlined
          v-model='req.pd_number'
          label='Номер'
          :rules='[val => (!!val && val.length > 0) || "Введите номер докумнета"]'
          lazy-rules
          mask='###-###'
        )
        q-input(
          rounded
          outlined
          v-model='req.date_begin'
          :rules='[val => (val && val.length > 0) || "Введите дату"]'
          lazy-rules
          mask='##.##.####'
        )
          template(v-slot:append)
            q-icon.cursor-pointer(name='event')
              q-popup-proxy(cover
                transition-show='scale'
                transition-hide='scale'
              )
                q-date(
                  v-model='req.date_begin'
                  today-btn
                  mask='DD.MM.YYYY'
                )
                  .row.items-center.justify-end
                    q-btn(
                      label='Закрыть'
                      color='primary'
                      v-close-popup
                      flat
                    )
        .grid.q-mt-sm
          template(v-for='file in req.files')
            div.relative-position
              q-icon.absolute-right.cursor-pointer.z-max(
                name='highlight_off'
                color='white' size='24px'
                @click='deleteFile(file)'
                v-if='!file.destroy'
              )
              q-icon.absolute-center.cursor-pointer.z-max(
                name='refresh'
                color='white' size='40px'
                @click='file.destroy = false'
                v-if='file.destroy'
              )
                q-tooltip Вернуть файл
              a(
                :href='file.file_url'
                target='_blank'
              )
                .img-container
                  img.img(
                    :src='file.file_url'
                  )
                  .destroy(v-if='file.destroy')
          .relative-position(style='width: 80px')
            q-file.relative-position.z-max(
              rounded
              outlined
              append
              @update:model-value='addFile'
              accept='.png, .jpeg'
              input-style='height: 70px'
            )
            q-icon.absolute-center(name='upload_file' size='32px' color='grey')
        q-card-actions.text-primary(align='right')
          q-btn(
            flat
            label='Закрыть'
            v-close-popup
          )
          q-btn(
            flat
            label='Отправить'
            type='submit'
            :loading='loading'
          )
</template>

<script lang='ts'>
import { defineComponent, onMounted, watch, ref, toRefs } from 'vue'
import { usePatientStore } from 'stores/patient-store'
import type { PersonalDocument, PersonalDocumentRes, File } from 'src/types/patient'
import { useDialogPluginComponent, QForm } from 'quasar'
import { cloneDeep, omit, remove, isEqual, filter } from 'lodash'
import notify from 'src/utils/util'

export default defineComponent({
  props: {
    document: {
      type: Object as () => PersonalDocument,
      required: false
    }
  },
  emits: [
    ...useDialogPluginComponent.emits
  ],
  setup (props) {
    const { dialogRef, onDialogHide } = useDialogPluginComponent()
    const { document } = toRefs(props)
    const patientStore = usePatientStore()
    const { patient } = toRefs(patientStore)
    const { createPersonalDocument, updatePersonalDocument, addFileToPersonalDocument, removeFile } = patientStore

    const req = ref({
      id: 1,
      document_type_id: '',
      document_type_name: '',
      pd_series: '',
      pd_number: '',
      date_begin: '',
      files: []
    } as PersonalDocument)
    const formRef = ref<QForm | null>(null)
    const options = ['Паспорт', 'Загран паспорт', 'Водительское удостоверение', 'Свидетельство рождения', 'Слово матери']
    const reqFiles = ref<FormData[]>([])
    const loading = ref(false)

    const addFile = async (file: any) => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('description', req.value.document_type_name)
      reqFiles.value.push(formData)
      req.value.files.push({
        file_url: URL.createObjectURL(file)
      } as File)
    }

    const deleteFile = async (file: any) => {
      if (file.id) {
        file.destroy = true
      } else {
        remove(req.value.files, (f) => f.file_url === file.file_url)
      }
    }

    const onSubmit = () => {
      if (formRef.value) {
        formRef.value.validate().then(async (success) => {
          if (success) {
            loading.value = true
            const response = ref({} as PersonalDocumentRes)
            const request = omit(req.value, ['files', 'id'])
            const isDocumentChanged = isEqual(omit(req.value, 'files'), omit(document.value, 'files'))
            const removeFiles = filter(req.value.files, { destroy: true })
            const filePromises = ref<any>([])
            let removeFilePromises: any = []
            try {
              if (document.value?.id && !isDocumentChanged) {
                response.value = await updatePersonalDocument(req.value.id, request)
                console.log('up')
              }
              if (!document.value?.id) {
                response.value = await createPersonalDocument(patient.value.id, request)
              }
              if (reqFiles.value.length) {
                const documentId = response.value.id ? response.value.id : req.value.id
                filePromises.value = reqFiles.value.map((file: any) => addFileToPersonalDocument(documentId, file))
                await Promise.all(filePromises.value)
              }
              if (removeFiles.length) {
                removeFilePromises = removeFiles.map((file: any) => removeFile(file.id))
                await Promise.all(removeFilePromises)
              }
              dialogRef.value?.hide()
              notify.positive(`Документ был ${document.value?.id ? 'изменён' : 'добавлен'}`)
            } catch (err) {
              notify.negative(err.message)
            } finally {
              loading.value = false
            }
          }
        })
      }
    }

    onMounted(() => {
      if (document.value) {
        req.value = cloneDeep(document.value)
      }
    })

    return {
      options,
      req,
      dialogRef,
      formRef,
      loading,
      addFile,
      deleteFile,
      onDialogHide,
      onSubmit
    }
  }
})
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-items: center;
}
.img {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  object-fit: cover;
  filter: brightness(80%)
}
.img-container {
  position: relative;
  width: 80px;
  height: 80px;
}
.destroy {
  border-radius: 10px;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000;
  opacity: 0.5;
}
</style>
