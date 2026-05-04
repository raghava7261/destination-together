const pool = require('../db')

async function createUser({ firstName, lastName, email, passwordHash, phone, city, travelStyle }) {
  const result = await pool.query(
    `INSERT INTO users (first_name, last_name, email, password_hash, phone, city, travel_style)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, first_name, last_name, email, phone, city, travel_style, created_at`,
    [firstName, lastName, email, passwordHash, phone, city, travelStyle]
  )
  return result.rows[0]
}

async function findUserByEmail(email) {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  )
  return result.rows[0]
}

async function findUserById(id) {
  const result = await pool.query(
    'SELECT id, first_name, last_name, email, phone, city, travel_style, created_at FROM users WHERE id = $1',
    [id]
  )
  return result.rows[0]
}

async function updateUser(id, fields) {
  const keys = Object.keys(fields)
  const values = Object.values(fields)
  const setClause = keys.map((k, i) => `${k} = $${i + 2}`).join(', ')
  const result = await pool.query(
    `UPDATE users SET ${setClause}, updated_at = NOW() WHERE id = $1
     RETURNING id, first_name, last_name, email, phone, city, travel_style`,
    [id, ...values]
  )
  return result.rows[0]
}

module.exports = { createUser, findUserByEmail, findUserById, updateUser }