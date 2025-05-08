import { DataTypes } from 'sequelize'

export const pembelian = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  tanggal_pembelian: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  },
  total_pembelian: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  id_supplier: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  id_cabang: {
    type: DataTypes.INTEGER,
    allowNull: true
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
}
