import { Router } from 'express'
import { CabangController } from '../controllers/cabang.controller'
import { SyncController } from '../controllers/sync.controller'

const router = Router()

router.get('/cabang', CabangController.getAll)
router.post('/cabang', CabangController.create)
router.patch('/cabang/:id', CabangController.update)
router.delete('/cabang/:id', CabangController.softDelete)

router.get('/sync/status', SyncController.SyncStatus)
router.post('/sync/manual', SyncController.SyncManual)

export default router
