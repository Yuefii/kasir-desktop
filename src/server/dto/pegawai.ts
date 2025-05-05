export interface PegawaiInterface {
  id?: number
  nama: string
  email: string
  password: string
  no_telp: string
  jenis_kelamin: string
  alamat: string
  role: string
  is_aktif: boolean
  isSynced?: boolean
  created_at?: Date
  updated_at?: Date
}
