import { getSequelize } from '../../database/conn'
import { defineKategoriModel } from '../entitas/kategori'

export const KategoriModelFactory = async () => {
  const sequelize = await getSequelize()
  return defineKategoriModel(sequelize)
}
