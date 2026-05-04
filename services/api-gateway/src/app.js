const express = require('express')
const cors = require('cors')
const helmet = require('helmet')

const app = express()

app.use(helmet())
app.use(cors({
  origin: '*',
  credentials: true,
}))

app.use((req, res, next) => {
  console.log(req.method, req.url)
  next()
})

app.get('/health', (req, res) => {
  res.json({ service: 'api-gateway', status: 'ok' })
})

const authMiddleware = require('./middleware/authMiddleware')
const setupRoutes = require('./routes/proxy')

app.use('/api', authMiddleware)
setupRoutes(app)

app.use((req, res) => res.status(404).json({ error: 'Route not found' }))

module.exports = app
