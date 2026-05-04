const app = require('./app')
const PORT = process.env.PORT || 4003
app.listen(PORT, () => console.log(`Fare service running on port ${PORT}`))
process.on('uncaughtException', (err) => console.error('Uncaught:', err.message))
setInterval(() => {}, 1000 * 60 * 60)
