import { Sequelize } from 'sequelize'
import { credentials } from './credentials'

const mysql = new Sequelize(credentials.database, credentials.user, credentials.password, {
  host: credentials.host,
  dialect: 'mysql',
  logging: false
})

export default mysql
