const http = require('http')

function forward(targetHost, targetPort, pathPrefix) {
  return (req, res) => {
    const path = pathPrefix + req.url
    const body = req.body ? JSON.stringify(req.body) : ''
    console.log('Forwarding', req.method, 'to', targetHost + ':' + targetPort + path)

    const options = {
      hostname: targetHost,
      port: targetPort,
      path: path,
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'x-user-id': req.headers['x-user-id'] || '',
        'x-user-email': req.headers['x-user-email'] || '',
        'authorization': req.headers['authorization'] || '',
      },
    }

    const proxy = http.request(options, (proxyRes) => {
      res.status(proxyRes.statusCode)
      Object.entries(proxyRes.headers).forEach(([k, v]) => res.setHeader(k, v))
      proxyRes.pipe(res)
    })

    proxy.on('error', (err) => {
      console.error('Forward error:', err.message)
      res.status(502).json({ error: 'Service unavailable' })
    })

    if (body) proxy.write(body)
    proxy.end()
  }
}

function setupRoutes(app) {
  const express = require('express')
  app.use(express.json())

  const USER_HOST  = process.env.USER_SERVICE_HOST  || 'user-service'
  const TRIP_HOST  = process.env.TRIP_SERVICE_HOST  || 'trip-service'
  const FARE_HOST  = process.env.FARE_SERVICE_HOST  || 'fare-service'
  const CHAT_HOST  = process.env.CHAT_SERVICE_HOST  || 'chat-service'
  const AI_HOST    = process.env.AI_SERVICE_HOST    || 'ai-service'

  app.use('/api/auth',  forward(USER_HOST, 4001, '/auth'))
  app.use('/api/trips', forward(TRIP_HOST, 4002, '/trips'))
  app.use('/api/fare',  forward(FARE_HOST, 4003, '/fare'))
  app.use('/api/chat',  forward(CHAT_HOST, 4004, '/chat'))
  app.use('/api/ai',    forward(AI_HOST,   4005, '/ai'))
}

module.exports = setupRoutes
