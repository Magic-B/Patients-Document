export interface File {
  id: number,
  file_url: string,
  description: string,
  file_extension: string,
  destroy?: boolean
}

export interface PersonalDocument {
  id: number,
  document_type_id: string,
  document_type_name: string,
  pd_series: string,
  pd_number: string,
  date_begin: string,
  files: File[]
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PersonalDocumentReq extends Omit<PersonalDocument, 'id' | 'files'>{}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PersonalDocumentRes extends Omit<PersonalDocument, 'files'>{}

export interface Patient {
  id: number,
  first_name: string,
  last_name: string,
  middle_name: string,
  personal_documents: PersonalDocument[]
}
