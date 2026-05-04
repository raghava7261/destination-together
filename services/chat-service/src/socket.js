const jwt = require('jsonwebtoken')
const { saveMessage } = require('./models/chatModel')

const JWT_SECRET = process.env.JWT_SECRET || 'destination_together_super_secret_2025'

function setupSocket(io) {
  // Auth middleware for socket
  io.use((socket, next) => {
    const token = socket.handshake.auth.token
    if (!token) return next(new Error('No token'))
    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      socket.user = decoded
      next()
    } catch (err) {
      next(new Error('Invalid token'))
    }
  })

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.email}`)

    // Join a conversation room
    socket.on('join_conversation', (conversationId) => {
      socket.join(conversationId)
      console.log(`${socket.user.email} joined room ${conversationId}`)
    })

    // Leave a conversation room
    socket.on('leave_conversation', (conversationId) => {
      socket.leave(conversationId)
    })

    // Send a message
    socket.on('send_message', async (data) => {
      try {
        const { conversationId, text, type } = data
        const message = await saveMessage({
          conversationId,
          senderId: socket.user.id,
          senderName: socket.user.email,
          text,
          type: type || 'text',
        })
        // Broadcast to all in room including sender
        io.to(conversationId).emit('new_message', message)
      } catch (err) {
        console.error('Socket send message error:', err)
        socket.emit('error', { message: 'Failed to send message' })
      }
    })

    // Typing indicator
    socket.on('typing', (data) => {
      socket.to(data.conversationId).emit('user_typing', {
        userId: socket.user.id,
        email: socket.user.email,
      })
    })

    socket.on('stop_typing', (data) => {
      socket.to(data.conversationId).emit('user_stop_typing', {
        userId: socket.user.id,
      })
    })

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.email}`)
    })
  })
}

module.exports = setupSocket
