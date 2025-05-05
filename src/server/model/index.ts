import { Sequelize } from 'sequelize'
import { defineKategori } from './define/define_kategori'
import { defineProduk } from './define/define_produk'
import { defineCabang } from './define/define_cabang'
import { defineInventori } from './define/define_inventori'
import { defineSupplier } from './define/define_supplier'
import { definePegawai } from './define/define_pegawai'

export const models: { [key: string]: any } = {}

export function syncAllModels(sequelize: Sequelize) {
  models.Kategori = defineKategori(sequelize)
  models.Produk = defineProduk(sequelize)
  models.Cabang = defineCabang(sequelize)
  models.Inventori = defineInventori(sequelize)
  models.Supplier = defineSupplier(sequelize)
  models.Pegawai = definePegawai(sequelize)

  models.Produk.belongsTo(models.Kategori, {
    foreignKey: 'id_kategori',
    as: 'kategori'
  })

  models.Kategori.hasMany(models.Produk, {
    foreignKey: 'id_kategori',
    as: 'produk_kategori'
  })

  models.Inventori.belongsTo(models.Produk, {
    foreignKey: 'id_produk',
    as: 'produk'
  })

  models.Produk.hasMany(models.Inventori, {
    foreignKey: 'id_produk',
    as: 'inventori_produk'
  })

  models.Inventori.belongsTo(models.Cabang, {
    foreignKey: 'id_cabang',
    as: 'cabang'
  })

  models.Cabang.hasMany(models.Inventori, {
    foreignKey: 'id_cabang',
    as: 'inventori_cabang'
  })

  return sequelize.sync()
}
