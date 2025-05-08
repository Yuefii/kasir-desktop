import { Sequelize } from 'sequelize'
import { pembelian } from '../entitas/pembelian'

export function definePembelian(sequelize: Sequelize) {
  return sequelize.define('pembelian', pembelian, {
    tableName: 'pembelian',
    timestamps: false
  })
}
