import { Sequelize } from 'sequelize'
import { cabang } from '../entitas/cabang'

export function defineCabang(sequelize: Sequelize) {
  return sequelize.define('cabang', cabang, {
    tableName: 'cabang',
    timestamps: false
  })
}
