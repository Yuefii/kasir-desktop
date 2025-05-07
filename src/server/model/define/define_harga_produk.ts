import { Sequelize } from 'sequelize'
import { hargaProduk } from '../entitas/harga_produk'

export function defineHargaProduk(sequelize: Sequelize) {
  return sequelize.define('harga_produk', hargaProduk, {
    tableName: 'harga_produk',
    timestamps: false
  })
}
