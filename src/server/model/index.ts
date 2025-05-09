import { Model, ModelStatic, Sequelize } from 'sequelize'
import { defineKategori } from './define/define_kategori'
import { defineProduk } from './define/define_produk'
import { defineCabang } from './define/define_cabang'
import { defineInventori } from './define/define_inventori'
import { defineSupplier } from './define/define_supplier'
import { definePegawai } from './define/define_pegawai'
import { defineHargaProduk } from './define/define_harga_produk'
import { definePembelian } from './define/define_pembelian'
import { definePembelianItem } from './define/define_pembelian_item'

// Objek untuk menyimpan semua model Sequelize yang didefinisikan
export const models: { [key: string]: ModelStatic<Model> } = {}

export function syncAllModels(sequelize: Sequelize): Promise<Sequelize> {
  // NOTE:
  // Inisialisasi semua model ke Sequelize dan simpan dalam objek models
  // Wajib melakukan ini sebelum melakukan sync
  // Agar semua relasi bisa dibuat
  // Jika tidak melakukan ini, relasi akan dibuat secara manual
  models.Kategori = defineKategori(sequelize)
  models.Produk = defineProduk(sequelize)
  models.HargaProduk = defineHargaProduk(sequelize)
  models.Cabang = defineCabang(sequelize)
  models.Inventori = defineInventori(sequelize)
  models.Supplier = defineSupplier(sequelize)
  models.Pegawai = definePegawai(sequelize)
  models.Pembelian = definePembelian(sequelize)
  models.PembelianItem = definePembelianItem(sequelize)

  // Relasi Produk -> Kategori
  // (banyak produk hanya bisa punya satu kategori)
  models.Produk.belongsTo(models.Kategori, {
    foreignKey: 'id_kategori',
    as: 'kategori'
  })
  // Relasi Kategori -> Produk
  // (satu kategori bisa memiliki banyak produk)
  models.Kategori.hasMany(models.Produk, {
    foreignKey: 'id_kategori',
    as: 'produk_kategori'
  })
  // Relasi Inventori -> Produk
  // (tiap stok akan terhubung ke produk)
  models.Inventori.belongsTo(models.Produk, {
    foreignKey: 'id_produk',
    as: 'produk'
  })
  models.Produk.hasMany(models.Inventori, {
    foreignKey: 'id_produk',
    as: 'inventori_produk'
  })
  // Relasi Inventori -> Cabang
  // (stok berada di cabang tertentu)
  models.Inventori.belongsTo(models.Cabang, {
    foreignKey: 'id_cabang',
    as: 'cabang'
  })
  models.Cabang.hasMany(models.Inventori, {
    foreignKey: 'id_cabang',
    as: 'inventori_cabang'
  })
  // Relasi HargaProduk -> Produk
  // (setiap harga terhubung ke produk)
  models.HargaProduk.belongsTo(models.Produk, {
    foreignKey: 'id_produk',
    as: 'produk'
  })
  models.Produk.hasMany(models.HargaProduk, {
    foreignKey: 'id_produk',
    as: 'harga_produk'
  })
  // Relasi HargaProduk -> Cabang
  // (harga bisa berbeda per cabang)
  models.HargaProduk.belongsTo(models.Cabang, {
    foreignKey: 'id_cabang',
    as: 'cabang'
  })
  models.Cabang.hasMany(models.HargaProduk, {
    foreignKey: 'id_cabang',
    as: 'harga_produk_cabang'
  })
  // Relasi Pembelian -> Supplier
  // (pembelian berasal dari supplier tertentu)
  models.Pembelian.belongsTo(models.Supplier, {
    foreignKey: 'id_supplier',
    as: 'supplier'
  })
  models.Supplier.hasMany(models.Pembelian, {
    foreignKey: 'id_supplier',
    as: 'pembelian_supplier'
  })
  // Relasi Pembelian -> Cabang
  // (pembelian pasti dilakukan oleh cabang tertentu)
  models.Pembelian.belongsTo(models.Cabang, {
    foreignKey: 'id_cabang',
    as: 'cabang'
  })
  models.Cabang.hasMany(models.Pembelian, {
    foreignKey: 'id_cabang',
    as: 'pembelian_cabang'
  })
  // Relasi PembelianItem -> Pembelian
  // (setiap item pembelian termasuk kedalam transaksi)
  models.PembelianItem.belongsTo(models.Pembelian, {
    foreignKey: 'id_pembelian',
    as: 'pembelian'
  })
  models.Pembelian.hasMany(models.PembelianItem, {
    foreignKey: 'id_pembelian',
    as: 'pembelian_item'
  })
  // Relasi PembelianItem -> Produk
  // (item mengacu ke produk tertentu)
  models.PembelianItem.belongsTo(models.Produk, {
    foreignKey: 'id_produk',
    as: 'produk'
  })
  models.Produk.hasMany(models.PembelianItem, {
    foreignKey: 'id_produk',
    as: 'pembelian_item_produk'
  })

  return sequelize.sync()
}
