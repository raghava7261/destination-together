const express = require('express')
const { body } = require('express-validator')
const { register, login, getProfile, updateProfile } = require('../controllers/authController')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/register', [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('firstName').notEmpty().withMessage('First name required'),
  body('lastName').notEmpty().withMessage('Last name required'),
], register)

router.post('/login', [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
], login)

router.get('/profile', authMiddleware, getProfile)
router.put('/profile', authMiddleware, updateProfile)

module.exports = router