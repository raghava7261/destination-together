const GAS_PRICE_PER_GALLON = 3.50
const AVG_MPG = 28
const TOLL_PER_100_MILES = 4.00

function calculateRideshareFare(distanceMiles, passengers) {
  const baseFare = distanceMiles * 0.25 + 10
  let discount = 0
  if (passengers >= 2) discount = 0.20
  if (passengers >= 3) discount = 0.30
  if (passengers >= 4) discount = 0.38
  if (passengers >= 5) discount = 0.44
  if (passengers >= 6) discount = 0.50
  const totalFare = baseFare * (1 - discount)
  const perPerson = totalFare / passengers
  return {
    baseFare: parseFloat(baseFare.toFixed(2)),
    discount: (discount * 100).toFixed(0) + '%',
    totalFare: parseFloat(totalFare.toFixed(2)),
    perPerson: parseFloat(perPerson.toFixed(2)),
    savings: parseFloat((baseFare - perPerson).toFixed(2)),
  }
}

function calculateVehicleFare(distanceMiles, passengers, mpg, gasPrice) {
  const effectiveMpg = mpg || AVG_MPG
  const effectiveGasPrice = gasPrice || GAS_PRICE_PER_GALLON
  const gallonsNeeded = distanceMiles / effectiveMpg
  const fuelCost = gallonsNeeded * effectiveGasPrice
  const tollCost = (distanceMiles / 100) * TOLL_PER_100_MILES
  const wearCost = distanceMiles * 0.21
  const totalCost = fuelCost + tollCost + wearCost
  const perPerson = totalCost / passengers
  return {
    fuelCost: parseFloat(fuelCost.toFixed(2)),
    tollCost: parseFloat(tollCost.toFixed(2)),
    wearCost: parseFloat(wearCost.toFixed(2)),
    totalCost: parseFloat(totalCost.toFixed(2)),
    perPerson: parseFloat(perPerson.toFixed(2)),
    breakdown: { gallonsNeeded: parseFloat(gallonsNeeded.toFixed(2)), gasPrice: effectiveGasPrice, mpg: effectiveMpg },
  }
}

async function calculateFare(req, res) {
  try {
    const { type, distanceMiles, passengers, mpg, gasPrice } = req.body
    if (!distanceMiles || !passengers) {
      return res.status(400).json({ error: 'distanceMiles and passengers are required' })
    }
    if (type === 'vehicle') {
      const fare = calculateVehicleFare(parseFloat(distanceMiles), parseInt(passengers), mpg ? parseFloat(mpg) : null, gasPrice ? parseFloat(gasPrice) : null)
      return res.status(200).json({ type: 'vehicle', ...fare })
    }
    const fare = calculateRideshareFare(parseFloat(distanceMiles), parseInt(passengers))
    return res.status(200).json({ type: 'rideshare', ...fare })
  } catch (err) {
    console.error('Calculate fare error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function getGroupDiscounts(req, res) {
  try {
    const { baseFare } = req.query
    if (!baseFare) return res.status(400).json({ error: 'baseFare is required' })
    const tiers = [1,2,3,4,5,6].map(p => {
      let discount = 0
      if (p >= 2) discount = 0.20
      if (p >= 3) discount = 0.30
      if (p >= 4) discount = 0.38
      if (p >= 5) discount = 0.44
      if (p >= 6) discount = 0.50
      const total = parseFloat(baseFare) * (1 - discount)
      return {
        passengers: p,
        discount: (discount * 100).toFixed(0) + '%',
        totalFare: parseFloat(total.toFixed(2)),
        perPerson: parseFloat((total / p).toFixed(2)),
      }
    })
    return res.status(200).json({ tiers })
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function estimateVehicle(req, res) {
  try {
    const { distanceMiles, passengers, mpg, gasPrice } = req.query
    if (!distanceMiles || !passengers) {
      return res.status(400).json({ error: 'distanceMiles and passengers are required' })
    }
    const fare = calculateVehicleFare(parseFloat(distanceMiles), parseInt(passengers), mpg ? parseFloat(mpg) : null, gasPrice ? parseFloat(gasPrice) : null)
    return res.status(200).json({ type: 'vehicle', ...fare })
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = { calculateFare, getGroupDiscounts, estimateVehicle }
