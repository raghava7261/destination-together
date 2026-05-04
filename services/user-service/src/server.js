const app = require('./app')

const PORT = process.env.PORT || 4001

app.listen(PORT, () => {
  console.log(`User service running on port ${PORT}`)
})

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message)
})

setInterval(() => {}, 1000 * 60 * 60)
