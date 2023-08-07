import { defineStore } from 'pinia'
import { backend } from 'src/api'
import { find, assign, remove, findIndex } from 'lodash'
import type { Patient, File, PersonalDocumentReq, PersonalDocumentRes } from 'src/types/patient'

export const usePatientStore = defineStore('patient', {
  state: () => ({
    patient: {} as Patient
  }),
  actions: {
    async getPatientData (patientId: number): Promise<void> {
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
    async removeFile (fileId: number): Promise<void> {
      await backend.removeFile(fileId)
      const documentIndex = findIndex(this.patient.personal_documents, document => {
        return document.files.some(item => item.id === fileId)
      })
      if (documentIndex !== -1) {
        remove(this.patient.personal_documents[documentIndex].files, { id: fileId })
      }
    }
  }
})
