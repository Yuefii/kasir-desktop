import { Router } from 'express'
import { CabangController } from '../controllers/cabang.controller'

const router = Router()

router.get('/cabang', CabangController.getAll)
router.post('/cabang', CabangController.create)

export default router
