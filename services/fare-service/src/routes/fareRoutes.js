const express = require('express')
const { calculateFare, getGroupDiscounts, estimateVehicle } = require('../controllers/fareController')
const authMiddleware = require('../middleware/authMiddleware')
const router = express.Router()
router.use(authMiddleware)
router.post('/calculate', calculateFare)
router.get('/group-discounts', getGroupDiscounts)
router.get('/estimate-vehicle', estimateVehicle)
module.exports = router
