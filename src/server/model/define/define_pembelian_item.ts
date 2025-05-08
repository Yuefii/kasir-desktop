import { Sequelize } from 'sequelize'
import { pembelianItem } from '../entitas/pembelian_item'

export function definePembelianItem(sequelize: Sequelize) {
  return sequelize.define('pembelian_item', pembelianItem, {
    tableName: 'pembelian_item',
    timestamps: false
  })
}
