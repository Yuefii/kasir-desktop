import { DataTypes } from 'sequelize'

export const pegawai = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nama: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  no_telp: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  jenis_kelamin: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  alamat: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING(20),
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
}
