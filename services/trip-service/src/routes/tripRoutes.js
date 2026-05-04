const express = require('express')
const { create, search, getTrip, join, myTrips } = require('../controllers/tripController')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

router.use(authMiddleware)

router.post('/', create)
router.get('/search', search)
router.get('/my', myTrips)
router.get('/:id', getTrip)
router.post('/:id/join', join)

module.exports = router
