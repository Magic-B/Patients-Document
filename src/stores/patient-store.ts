import { defineStore } from 'pinia'
import { backend } from 'src/api'
import type { Patient, PersonalDocument } from 'src/types/patient'

export const usePatientStore = defineStore('patient', {
  state: () => ({
    patients: null,
    patient: {
      id: 1,
      first_name: 'Ivan',
      last_name: 'Ivanov',
      middle_name: 'Ivanovich',
      personal_documents: [
        {
          id: 1,
          document_type_id: 'Паспорт',
          document_type_name: 'Паспорт',
          pd_series: '1232124415',
          pd_number: '123-456',
          date_begin: '18.06.2023',
          files: [
            {
              id: 1,
              file_url: 'file.com',
              description: 'Файл',
              file_extension: 'png'
            }
          ]
        }
      ]
    } as Patient
  }),
  getters: {
  },
  actions: {
    async createPersonalDocument (patientId: number, data: Omit<PersonalDocument, 'id'>) {
      try {
        await backend.createPersonalDocument(patientId, data)
      } catch (err: any) {

      }
    }
  }
})
