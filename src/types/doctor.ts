export interface DoctorData {
  id?: string
  name: string
  email: string
  phone: string
  specialty: string
  qualifications: string
  experience: number
  bio: string
  about: string
  education: Array<{
    degree: string
    institution: string
    year: string
  }>
  consultationFee: number
  isAvailable: boolean
  avatar: string
  languages: string[]
  address: string
  hospitalAffiliation: string
  updatedAt?: Date
  updateDoctorData?: (data: Partial<DoctorData>) => void
} 