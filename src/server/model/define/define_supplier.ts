import { Sequelize } from 'sequelize'
import { supplier } from '../entitas/supplier'

export function defineSupplier(sequelize: Sequelize) {
  return sequelize.define('supplier', supplier, {
    tableName: 'supplier',
    timestamps: false
  })
}
