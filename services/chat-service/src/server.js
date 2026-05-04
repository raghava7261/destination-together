const http = require('http')
const { Server } = require('socket.io')
const app = require('./app')
const setupSocket = require('./socket')

const PORT = process.env.PORT || 4004

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
})

setupSocket(io)

server.listen(PORT, () => {
  console.log(`Chat service running on port ${PORT}`)
  console.log(`WebSocket ready on port ${PORT}`)
})

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message)
})

setInterval(() => {}, 1000 * 60 * 60)
