import { Sequelize } from 'sequelize'
import { inventori } from '../entitas/inventori'

export function defineInventori(sequelize: Sequelize) {
  return sequelize.define('inventori', inventori, {
    tableName: 'inventori',
    timestamps: false
  })
}
