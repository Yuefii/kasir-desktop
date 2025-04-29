import { DataTypes, Model, Optional, Sequelize } from 'sequelize'

export interface KategoriInterface {
  id?: number
  nama: string
  isSynced?: boolean
  created_at?: Date
}

export type CabangCreationAttributes = Optional<KategoriInterface, 'id' | 'isSynced' | 'created_at'>

export interface KategoriInstance
  extends Model<KategoriInterface, CabangCreationAttributes>,
    KategoriInterface {}

export const defineKategoriModel = async (sequelize: Sequelize) => {
  return sequelize.define<KategoriInstance>(
    'kategori',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      nama: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      isSynced: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    {
      tableName: 'kategori',
      timestamps: false
    }
  )
}
