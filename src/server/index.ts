import cors from 'cors'
import router from './routes'
import express from 'express'
import { getMode, tryConnectMySQL } from './database/conn'
import { isConnectedToInternet } from './utils/check_connection'

export function startExpress() {
  const app = express()
  const PORT = 3001

  app.use(cors())
  app.use(express.json())
  app.use(async (_req, _res, next) => {
    if (getMode() === 'offline') {
      const online = await isConnectedToInternet()
      if (online) {
        await tryConnectMySQL()
      }
    }
    next()
  })
  app.use('/api', router)

  app.get('/api/data', (_, res) => {
    res.json({ message: 'Data dari Express dalam Electron!', timestamp: Date.now() })
  })

  app.get('/mode', (_, res) => {
    res.json({ mode: getMode() })
  })

  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })

  return server
}
