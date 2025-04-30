import { DataTypes, Model, Optional, Sequelize } from 'sequelize'

export interface ProdukInterface {
  id?: number
  kode_produk: string
  nama: string
  deskripsi: string
  brand: string
  unit: string
  id_kategori?: number
  is_aktif: boolean
  isSynced?: boolean
  created_at?: Date
  updated_at?: Date
}

export type ProdukCreationAttributes = Optional<ProdukInterface, 'id' | 'isSynced' | 'created_at'>

export interface ProdukInstance
  extends Model<ProdukInterface, ProdukCreationAttributes>,
    ProdukInterface {}

export const defineProdukModel = async (sequelize: Sequelize) => {
  return sequelize.define<ProdukInstance>(
    'produk',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      kode_produk: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false
      },
      nama: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      deskripsi: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      brand: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      unit: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      id_kategori: {
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
      tableName: 'produk',
      timestamps: false
    }
  )
}
