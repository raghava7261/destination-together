const app = require('./app')

const PORT = process.env.PORT || 4002

app.listen(PORT, () => {
  console.log(`Trip service running on port ${PORT}`)
})

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message)
})

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err)
})

setInterval(() => {}, 1000 * 60 * 60)
