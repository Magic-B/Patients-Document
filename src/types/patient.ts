export interface File {
  id: number,
  file_url: string,
  description: string,
  file_extension: string
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

export interface Patient {
  id: number,
  first_name: string,
  last_name: string,
  middle_name: string,
  personal_documents: PersonalDocument[]
}
