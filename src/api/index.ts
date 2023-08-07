import axios from 'axios'
import type { PersonalDocumentReq } from 'src/types/patient'

const baseURL = import.meta.env.VITE_BASE_API

const adapter = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json'
  }
})

const backend = {
  baseURL,
  getPatientData: (patientId: number) => adapter.get(`/patient/${patientId}`),
  createPersonalDocument: (patientId: number, data: PersonalDocumentReq) => adapter.post(`/patients/${patientId}/personal_documents`, data),
  updatePersonalDocument: (documentId: number, data: PersonalDocumentReq) => adapter.patch(`/personal_documents/${documentId}`, data),
  addFileToPersonalDocument: (documentId: number, file: FormData) => adapter.post(`/personal_documents/${documentId}/files`),
  removeFile: (fileId: number) => adapter.delete(`/documents/${fileId}`)
}

export { backend }
