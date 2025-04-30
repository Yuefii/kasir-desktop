import { Sequelize } from 'sequelize'
import { kategori } from '../entitas/kategori'

export function defineKategori(sequelize: Sequelize) {
  return sequelize.define('kategori', kategori, {
    tableName: 'kategori',
    timestamps: false
  })
}
