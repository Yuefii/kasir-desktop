import { DataTypes, Model, Optional, Sequelize } from 'sequelize'

export interface CabangInterface {
  id?: number
  kode_cabang: string
  nama: string
  alamat: string
  is_aktif?: boolean
  isSynced?: boolean
  created_at?: Date
}

export type CabangCreationAttributes = Optional<
  CabangInterface,
  'id' | 'isSynced' | 'created_at' | 'is_aktif'
>

export interface CabangInstance
  extends Model<CabangInterface, CabangCreationAttributes>,
    CabangInterface {}

export const defineCabangModel = async (sequelize: Sequelize) => {
  return sequelize.define<CabangInstance>(
    'cabang',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      kode_cabang: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: false
      },
      nama: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      alamat: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      is_aktif: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
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
      tableName: 'cabang',
      timestamps: false
    }
  )
}
