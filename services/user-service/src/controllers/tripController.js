const { createTrip, searchTrips, getTripById, joinTrip, getUserTrips } = require('../models/tripModel')

async function create(req, res) {
  try {
    const { fromCity, toCity, tripDate, departureTime, totalSeats, tripType, vehicleModel, baseFare } = req.body
    if (!fromCity || !toCity || !tripDate || !departureTime) {
      return res.status(400).json({ error: 'fromCity, toCity, tripDate, departureTime are required' })
    }
    const trip = await createTrip({
      creatorId: req.user.id,
      fromCity, toCity, tripDate, departureTime,
      totalSeats: totalSeats || 4,
      tripType: tripType || 'rideshare',
      vehicleModel, baseFare,
    })
    return res.status(201).json({ message: 'Trip created', trip })
  } catch (err) {
    console.error('Create trip error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function search(req, res) {
  try {
    const { fromCity, toCity, tripDate } = req.query
    if (!fromCity || !toCity || !tripDate) {
      return res.status(400).json({ error: 'fromCity, toCity, tripDate are required' })
    }
    const trips = await searchTrips({ fromCity, toCity, tripDate })
    return res.status(200).json({ trips, count: trips.length })
  } catch (err) {
    console.error('Search trips error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function getTrip(req, res) {
  try {
    const trip = await getTripById(req.params.id)
    if (!trip) return res.status(404).json({ error: 'Trip not found' })
    return res.status(200).json({ trip })
  } catch (err) {
    console.error('Get trip error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function join(req, res) {
  try {
    await joinTrip(req.params.id, req.user.id)
    return res.status(200).json({ message: 'Joined trip successfully' })
  } catch (err) {
    console.error('Join trip error:', err.message)
    return res.status(400).json({ error: err.message })
  }
}

async function myTrips(req, res) {
  try {
    const trips = await getUserTrips(req.user.id)
    return res.status(200).json({ trips })
  } catch (err) {
    console.error('My trips error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = { create, search, getTrip, join, myTrips }