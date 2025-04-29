import { getSequelize } from '../../database/conn'
import { defineKategoriModel } from '../kategori'
import { defineProdukModel } from '../produk'

export const ProdukModelFactory = async () => {
  const sequelize = await getSequelize()

  const Produk = await defineProdukModel(sequelize)
  const Kategori = await defineKategoriModel(sequelize)

  Produk.belongsTo(Kategori, { foreignKey: 'id_kategori', as: 'kategori' })
  Kategori.hasMany(Produk, { foreignKey: 'id_kategori', as: 'produk_kategori' })

  await sequelize.sync()

  return { Produk, Kategori }
}
