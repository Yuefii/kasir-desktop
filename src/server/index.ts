import cors from 'cors'
import router from './routes'
import express from 'express'
import { DB } from './database/config'

export function startExpress() {
  const app = express()
  const PORT = 3001

  app.use(cors())
  app.use(express.json())
  app.use('/api', router)

  app.get('/api/data', (_, res) => {
    res.json({ message: 'Data dari Express dalam Electron!', timestamp: Date.now() })
  })

  DB.initializeDatabase()
    .then(() => {
      console.log('Database initialization complete')
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
      })
    })
    .catch((err) => {
      console.error('Failed to initialize database:', err)
      process.exit(1)
    })
}
