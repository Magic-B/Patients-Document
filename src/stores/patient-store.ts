import { defineStore } from 'pinia'
import { backend } from 'src/api'
import { find, assign } from 'lodash'
import type { Patient, File, PersonalDocumentReq, PersonalDocumentRes } from 'src/types/patient'

export const usePatientStore = defineStore('patient', {
  state: () => ({
    patient: {} as Patient
  }),
  getters: {
  },
  actions: {
    async getPatientData (patientId: number) {
      const response = await backend.getPatientData(patientId)
      this.patient = response.data
    },
    async createPersonalDocument (patientId: number, data: PersonalDocumentReq): Promise<PersonalDocumentRes> {
      const response = await backend.createPersonalDocument(patientId, data)
      this.patient.personal_documents.push(response.data)
      return response.data
    },
    async updatePersonalDocument (documentId: number, data: PersonalDocumentReq): Promise<PersonalDocumentRes> {
      const response = await backend.updatePersonalDocument(documentId, data)
      const personalDocument = find(this.patient.personal_documents, { id: documentId })
      assign(personalDocument, response.data)
      console.log(this.patient)
      return response.data
    },
    async addFileToPersonalDocument (documentId: number, file: FormData): Promise<File> {
      const response = await backend.addFileToPersonalDocument(documentId, file)
      const personalDocument = find(this.patient.personal_documents, { id: documentId })
      if (personalDocument) {
        personalDocument.files.push(response.data)
      }
      return response.data
    },
    async removeFile (fileId: number) {
      await backend.removeFile(fileId)
    }
  }
})
