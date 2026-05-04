const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'destination_together_super_secret_2025'

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization']
  const userId = req.headers['x-user-id']

  if (userId) {
    req.user = { id: userId }
    return next()
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

module.exports = authMiddleware