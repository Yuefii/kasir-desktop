import { defineCabangModel } from '../entitas/cabang'
import { getSequelize } from '../../database/conn'

export const CabangModelFactory = async () => {
  const sequelize = await getSequelize()
  return defineCabangModel(sequelize)
}
