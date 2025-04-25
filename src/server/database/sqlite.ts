import { Sequelize } from 'sequelize'

const sqlite = new Sequelize({
  dialect: 'sqlite',
  storage: './src/server/database/database.sqlite',
  logging: false
})

export default sqlite
