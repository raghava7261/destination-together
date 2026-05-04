const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const authRoutes = require('./routes/authRoutes')

const app = express()

app.use(helmet())
app.use(cors({ origin: '*', credentials: true }))
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ service: 'user-service', status: 'ok' })
})

app.use('/auth', authRoutes)

app.use((req, res) => res.status(404).json({ error: 'Route not found' }))

module.exports = app
