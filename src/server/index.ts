import express from 'express'
import cors from 'cors'

export function startExpress() {
  const app = express()
  const port = 3001

  app.use(cors())
  app.use(express.json())

  app.get('/api/data', (_, res) => {
    res.json({ message: 'Data dari Express dalam Electron!', timestamp: Date.now() })
  })

  const server = app.listen(port, () => {
    console.log(`Express API server berjalan di http://localhost:${port}`)
  })

  return server
}
