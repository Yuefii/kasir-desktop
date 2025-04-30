import { DataTypes, Model, Optional, Sequelize } from 'sequelize'

export interface SupplierInterface {
  id?: number
  nama: string
  no_telp?: string
  alamat: string
  isSynced?: boolean
  created_at?: Date
  updated_at?: Date
}

export type SupplierCreationAttributes = Optional<
  SupplierInterface,
  'id' | 'isSynced' | 'created_at'
>

export interface SupplierInstance
  extends Model<SupplierInterface, SupplierCreationAttributes>,
    SupplierInterface {}

export const defineSupplierModel = async (sequelize: Sequelize) => {
  return sequelize.define<SupplierInstance>(
    'supplier',
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
      no_telp: {
        type: DataTypes.STRING(15),
        allowNull: false
      },
      alamat: {
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
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    {
      tableName: 'supplier',
      timestamps: false
    }
  )
}
