const { Pool } = require('pg')

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME     || 'destination_together',
  user:     process.env.DB_USER     || 'raghavasammeta',
  password: process.env.DB_PASSWORD || '',
})

pool.on('connect', () => console.log('PostgreSQL connected'))
pool.on('error', (err) => console.error('PostgreSQL error:', err))

module.exports = pool
