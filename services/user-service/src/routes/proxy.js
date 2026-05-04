const { createProxyMiddleware } = require('http-proxy-middleware')

function createProxy(target, pathRewrite) {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite,
    on: {
      error: (err, req, res) => {
        console.error('Proxy error:', err.message)
        res.status(502).json({ error: 'Service unavailable' })
      },
    },
  })
}

function setupRoutes(app) {
  const USER_SERVICE    = process.env.USER_SERVICE_URL    || 'http://localhost:4001'
  const TRIP_SERVICE    = process.env.TRIP_SERVICE_URL    || 'http://localhost:4002'
  const FARE_SERVICE    = process.env.FARE_SERVICE_URL    || 'http://localhost:4003'
  const CHAT_SERVICE    = process.env.CHAT_SERVICE_URL    || 'http://localhost:4004'
  const AI_SERVICE      = process.env.AI_SERVICE_URL      || 'http://localhost:4005'
  const NOTIF_SERVICE   = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:4006'

  // User Service — /api/auth/** → http://localhost:4001/auth/**
  app.use('/api/auth', createProxy(USER_SERVICE, { '^/api/auth': '/auth' }))

  // Trip Service — /api/trips/** → http://localhost:4002/trips/**
  app.use('/api/trips', createProxy(TRIP_SERVICE, { '^/api/trips': '/trips' }))

  // Fare Service — /api/fare/** → http://localhost:4003/fare/**
  app.use('/api/fare', createProxy(FARE_SERVICE, { '^/api/fare': '/fare' }))

  // Chat Service — /api/chat/** → http://localhost:4004/chat/**
  app.use('/api/chat', createProxy(CHAT_SERVICE, { '^/api/chat': '/chat' }))

  // AI Service — /api/ai/** → http://localhost:4005/ai/**
  app.use('/api/ai', createProxy(AI_SERVICE, { '^/api/ai': '/ai' }))

  // Notification Service — /api/notifications/** → http://localhost:4006/notifications/**
  app.use('/api/notifications', createProxy(NOTIF_SERVICE, { '^/api/notifications': '/notifications' }))
}

module.exports = setupRoutes