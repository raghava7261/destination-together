const http = require('http')
const app = require('./app')

const PORT = process.env.PORT || 4000

const server = http.createServer(app)

server.listen(PORT, '0.0.0.0', () => {
  console.log(`API Gateway running on port ${PORT}`)
})

server.on('error', (err) => {
  console.error('Server error:', err)
})

setInterval(() => {}, 1000 * 60 * 60)
