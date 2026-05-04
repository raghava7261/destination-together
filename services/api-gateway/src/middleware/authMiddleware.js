const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || 'destination_together_super_secret_2025'

function authMiddleware(req, res, next) {
  console.log('Auth middleware:', req.method, req.path, req.url)

  if (
    req.path.startsWith('/auth') ||
    req.path.startsWith('/api/auth') ||
    req.path === '/health'
  ) {
    return next()
  }

  const authHeader = req.headers['authorization']
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    req.headers['x-user-id'] = decoded.id
    req.headers['x-user-email'] = decoded.email
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

module.exports = authMiddleware
