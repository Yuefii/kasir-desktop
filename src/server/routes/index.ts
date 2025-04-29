import { Router } from 'express'
import { CabangController } from '../controllers/cabang.controller'
import { SyncController } from '../controllers/sync.controller'
import { KategoriController } from '../controllers/kategori.controller'
import { ProdukController } from '../controllers/produk.controller'
import { InventoriController } from '../controllers/inventori.controller'

const router = Router()

router.get('/cabang', CabangController.getAll)
router.post('/cabang', CabangController.create)
router.patch('/cabang/:id', CabangController.update)
router.delete('/cabang/:id', CabangController.softDelete)

router.get('/kategori', KategoriController.getAll)
router.post('/kategori', KategoriController.create)
router.patch('/kategori/:id', KategoriController.update)
router.delete('/kategori/:id', KategoriController.delete)

router.get('/produk', ProdukController.getAll)
router.post('/produk', ProdukController.create)
router.patch('/produk/:id', ProdukController.update)
router.delete('/produk/:id', ProdukController.softDelete)

router.get('/inventori', InventoriController.getAll)
router.post('/inventori', InventoriController.create)
router.patch('/inventori/:id', InventoriController.update)
router.delete('/inventori/:id', InventoriController.softDelete)

router.get('/sync/status', SyncController.SyncStatus)
router.post('/sync/manual', SyncController.SyncManual)

export default router
