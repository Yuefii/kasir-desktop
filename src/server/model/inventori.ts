import { DataTypes, Model, Optional, Sequelize } from 'sequelize'

export interface InventoriInterface {
  id?: number
  jumlah_stok: number
  stok_minimal: number
  id_produk?: number
  id_cabang?: number
  is_aktif: boolean
  isSynced?: boolean
  created_at?: Date
  updated_at?: Date
}

export type CabangCreationAttributes = Optional<
  InventoriInterface,
  'id' | 'isSynced' | 'created_at'
>

export interface InventoriInstance
  extends Model<InventoriInterface, CabangCreationAttributes>,
    InventoriInterface {}

export const defineInventoriModel = async (sequelize: Sequelize) => {
  return sequelize.define<InventoriInstance>(
    'inventori',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      jumlah_stok: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      stok_minimal: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      id_cabang: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      id_produk: {
        type: DataTypes.INTEGER,
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
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    {
      tableName: 'inventori',
      timestamps: false
    }
  )
}
