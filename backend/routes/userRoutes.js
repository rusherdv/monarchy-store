import express from 'express'
import { getProducts, getOrders, exchangeCode, editProduct, createProduct, deleteProduct, generateCode, getAllOrders } from '../controllers/userControllers.js'
import checkAdmin from '../middleware/authMiddleware.js'

const router = express.Router()

// user

router.get('/products', getProducts)

router.post('/orders', getOrders)

router.post('/code', exchangeCode)

// admin

router.post('/allorders', checkAdmin, getAllOrders)

router.post('/deleteproduct', checkAdmin, deleteProduct)

router.post('/createproduct', checkAdmin, createProduct)

router.post('/editproduct', checkAdmin, editProduct)

router.post('/generatecode', checkAdmin, generateCode)

export default router