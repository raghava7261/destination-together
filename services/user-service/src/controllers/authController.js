const { validationResult } = require('express-validator')
const { createUser, findUserByEmail, findUserById, updateUser } = require('../models/userModel')
const { hashPassword, comparePassword } = require('../utils/hash')
const { generateToken } = require('../utils/jwt')

async function register(req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  try {
    const { firstName, lastName, email, password, phone, city, travelStyle } = req.body
    const existing = await findUserByEmail(email)
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' })
    }
    const passwordHash = await hashPassword(password)
    const user = await createUser({ firstName, lastName, email, passwordHash, phone, city, travelStyle })
    const token = generateToken({ id: user.id, email: user.email })
    return res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        city: user.city,
      },
    })
  } catch (err) {
    console.error('Register error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function login(req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  try {
    const { email, password } = req.body
    const user = await findUserByEmail(email)
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }
    const valid = await comparePassword(password, user.password_hash)
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }
    const token = generateToken({ id: user.id, email: user.email })
    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        city: user.city,
      },
    })
  } catch (err) {
    console.error('Login error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function getProfile(req, res) {
  try {
    const user = await findUserById(req.user.id)
    if (!user) return res.status(404).json({ error: 'User not found' })
    return res.status(200).json({ user })
  } catch (err) {
    console.error('GetProfile error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function updateProfile(req, res) {
  try {
    const { firstName, lastName, phone, city, travelStyle } = req.body
    const updated = await updateUser(req.user.id, {
      first_name: firstName,
      last_name: lastName,
      phone,
      city,
      travel_style: travelStyle,
    })
    return res.status(200).json({ message: 'Profile updated', user: updated })
  } catch (err) {
    console.error('UpdateProfile error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = { register, login, getProfile, updateProfile }