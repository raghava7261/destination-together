const express = require('express')
const router = express.Router()
const { getPOIAlerts, getRouteInfo } = require('../controllers/aiController')

router.post('/poi-alerts', getPOIAlerts)
router.post('/route-info', getRouteInfo)

module.exports = router
