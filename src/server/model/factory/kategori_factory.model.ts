import { getSequelize } from '../../database/conn'
import { defineKategoriModel } from '../kategori'

export const KategoriModelFactory = async () => {
  const sequelize = await getSequelize()
  return defineKategoriModel(sequelize)
}
