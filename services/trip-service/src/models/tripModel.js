const pool = require('../db')

async function createTrip({ creatorId, fromCity, toCity, tripDate, departureTime, totalSeats, tripType, vehicleModel, baseFare, venmoHandle, zellHandle, vehicleMpg }) {
  const result = await pool.query(
    `INSERT INTO trips (creator_id, from_city, to_city, trip_date, departure_time, total_seats, available_seats, trip_type, vehicle_model, base_fare, venmo_handle, zelle_handle, vehicle_mpg)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
    [creatorId, fromCity, toCity, tripDate, departureTime, totalSeats, totalSeats - 1, tripType, vehicleModel, baseFare, venmoHandle, zellHandle, vehicleMpg || 28]
  )
  return result.rows[0]
}

async function searchTrips({ fromCity, toCity, tripDate }) {
  const result = await pool.query(
    `SELECT t.*, COUNT(tm.id) as member_count
     FROM trips t
     LEFT JOIN trip_members tm ON t.id = tm.trip_id AND tm.status = 'approved'
     WHERE LOWER(t.from_city) LIKE LOWER($1)
       AND LOWER(t.to_city) LIKE LOWER($2)
       AND t.trip_date = $3
       AND t.status = 'active'
       AND t.available_seats > 0
     GROUP BY t.id
     ORDER BY t.departure_time ASC`,
    [`%${fromCity}%`, `%${toCity}%`, tripDate]
  )
  return result.rows
}

async function getTripById(id) {
  const result = await pool.query(
    `SELECT t.*, COUNT(tm.id) as member_count
     FROM trips t
     LEFT JOIN trip_members tm ON t.id = tm.trip_id
     WHERE t.id = $1 GROUP BY t.id`,
    [id]
  )
  return result.rows[0]
}

async function joinTrip(tripId, userId) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const existing = await client.query(
      'SELECT * FROM trip_members WHERE trip_id = $1 AND user_id = $2',
      [tripId, userId]
    )
    if (existing.rows.length > 0) throw new Error('Already joined this trip')
    await client.query(
      'INSERT INTO trip_members (trip_id, user_id, status) VALUES ($1,$2,$3)',
      [tripId, userId, 'approved']
    )
    await client.query(
      'UPDATE trips SET available_seats = available_seats - 1 WHERE id = $1',
      [tripId]
    )
    await client.query('COMMIT')
    return { success: true }
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}

async function getUserTrips(userId) {
  const result = await pool.query(
    `SELECT t.* FROM trips t
     LEFT JOIN trip_members tm ON t.id = tm.trip_id
     WHERE t.creator_id = $1 OR tm.user_id = $1
     GROUP BY t.id ORDER BY t.trip_date DESC`,
    [userId]
  )
  return result.rows
}

module.exports = { createTrip, searchTrips, getTripById, joinTrip, getUserTrips }
