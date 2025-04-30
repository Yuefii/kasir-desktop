import { getSequelize } from '../../database/conn'
import { defineSupplierModel } from '../supplier'

export const SupplierModelFactory = async () => {
  const sequelize = await getSequelize()
  return defineSupplierModel(sequelize)
}
