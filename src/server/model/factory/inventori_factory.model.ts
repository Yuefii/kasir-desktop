import { getSequelize } from '../../database/conn'
import { defineCabangModel } from '../cabang'
import { defineInventoriModel } from '../inventori'
import { defineProdukModel } from '../produk'

export const InventoriModelFactory = async () => {
  const sequelize = await getSequelize()

  const Inventori = await defineInventoriModel(sequelize)
  const Produk = await defineProdukModel(sequelize)
  const Cabang = await defineCabangModel(sequelize)

  Inventori.belongsTo(Produk, { foreignKey: 'id_produk', as: 'produk' })
  Produk.hasMany(Inventori, { foreignKey: 'id_produk', as: 'inventori_produk' })

  Inventori.belongsTo(Cabang, { foreignKey: 'id_cabang', as: 'cabang' })
  Cabang.hasMany(Inventori, { foreignKey: 'id_cabang', as: 'inventori_cabang' })

  await sequelize.sync()

  return { Produk, Cabang, Inventori }
}
