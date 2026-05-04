const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const tripRoutes = require('./routes/tripRoutes')

const app = express()

app.use(helmet())
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}))
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ service: 'trip-service', status: 'ok' })
})

app.use('/trips', tripRoutes)

app.use((req, res) => res.status(404).json({ error: 'Route not found' }))

module.exports = app
