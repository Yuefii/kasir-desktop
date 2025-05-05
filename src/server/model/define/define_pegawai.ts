import { Sequelize } from 'sequelize'
import { pegawai } from '../entitas/pegawai'

export function definePegawai(sequelize: Sequelize) {
  return sequelize.define('pegawai', pegawai, {
    tableName: 'pegawai',
    timestamps: false
  })
}
