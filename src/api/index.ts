import axios from 'axios'
import type { Patient, PersonalDocument, File } from 'src/types/patient'

const baseURL = process.env.BASE_API

const adapter = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json'
  }
})

const backend = {
  baseURL,
  getPatientData: (patientId: number): Promise<Patient> => adapter.get(`/patient/${patientId}`),
  createPersonalDocument: (patientId: number, data: Omit<PersonalDocument, 'id'>) => adapter.post(`/patients/${patientId}/personal_documents`, data),
  updatePersonalDocument: (documentId: number, data: Omit<PersonalDocument, 'id'>) => adapter.put(`/personal_documents/${documentId}`, data),
  addFileToPersonalDocument: (documentId: number) => adapter.post(`/personal_documents/${documentId}/files`),
  getFile: (fileId: number): Promise<File> => adapter.get(`/files/${fileId}`),
  updateFile: (fileId: number) => adapter.put(`/files/${fileId}`),
  removeFile: (fileId: number) => adapter.delete(`/documents/${fileId}`)
}

export { backend }
