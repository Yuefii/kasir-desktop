import { Sequelize } from 'sequelize'
import { produk } from '../entitas/produk'

export function defineProduk(sequelize: Sequelize) {
  return sequelize.define('produk', produk, {
    tableName: 'produk',
    timestamps: false
  })
}
