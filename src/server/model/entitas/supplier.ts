import { DataTypes } from 'sequelize'

export const supplier = {
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
}
