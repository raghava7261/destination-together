import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --ink: #0d0d0d; --paper: #f7f5f0; --accent: #1a6b4a;
    --accent2: #e8673a; --muted: #6b6b63; --border: #e0ddd5;
    --card: #ffffff;
    --serif: 'DM Serif Display', Georgia, serif;
    --sans: 'DM Sans', sans-serif;
  }
  .tp-body { background: var(--paper); font-family: var(--sans); min-height: 100vh; color: var(--ink); }
  .tp-nav { position: sticky; top: 0; z-index: 100; padding: 16px 48px; display: flex; align-items: center; justify-content: space-between; background: rgba(247,245,240,0.95); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border); }
  .tp-nav-logo { font-family: var(--serif); font-size: 1.2rem; color: var(--ink); text-decoration: none; }
  .tp-nav-logo span { color: var(--accent); }
  .tp-nav-right { display: flex; align-items: center; gap: 20px; }
  .tp-nav-link { font-size: 0.85rem; color: var(--muted); text-decoration: none; transition: color 0.2s; }
  .tp-nav-link:hover { color: var(--ink); }
  .tp-nav-avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--ink); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 500; cursor: pointer; }
  .tp-layout { display: grid; grid-template-columns: 380px 1fr; min-height: calc(100vh - 69px); }
  .tp-search-panel { background: var(--card); border-right: 1px solid var(--border); padding: 32px 28px; overflow-y: auto; max-height: calc(100vh - 69px); position: sticky; top: 69px; }
  .tp-panel-title { font-family: var(--serif); font-size: 1.5rem; color: var(--ink); letter-spacing: -0.02em; margin-bottom: 6px; }
  .tp-panel-sub { font-size: 0.82rem; color: var(--muted); margin-bottom: 28px; }
  .tp-field { margin-bottom: 18px; }
  .tp-label { display: block; font-size: 0.75rem; font-weight: 500; color: var(--ink); margin-bottom: 7px; letter-spacing: 0.03em; text-transform: uppercase; }
  .tp-input { width: 100%; padding: 12px 14px; border: 1px solid var(--border); border-radius: 10px; font-size: 0.88rem; font-family: var(--sans); background: var(--paper); color: var(--ink); outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
  .tp-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(26,107,74,0.08); background: var(--card); }
  .tp-input::placeholder { color: #b0aea7; }
  .tp-input-icon-wrap { position: relative; }
  .tp-input-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 0.9rem; pointer-events: none; }
  .tp-input-with-icon { padding-left: 36px; }
  .tp-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .tp-select { width: 100%; padding: 12px 14px; border: 1px solid var(--border); border-radius: 10px; font-size: 0.88rem; font-family: var(--sans); background: var(--paper); color: var(--ink); outline: none; appearance: none; cursor: pointer; background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236b6b63' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 36px; }
  .tp-select:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(26,107,74,0.08); }
  .tp-vehicle-box { background: #f0faf5; border: 1px solid #d5eee2; border-radius: 12px; padding: 16px; margin-bottom: 18px; }
  .tp-vehicle-box-title { font-size: 0.72rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent); margin-bottom: 14px; }
  .tp-rental-box { background: #f0f4ff; border: 1px solid #c7d2fe; border-radius: 12px; padding: 16px; margin-bottom: 18px; }
  .tp-rental-box-title { font-size: 0.72rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.08em; color: #4a6ee8; margin-bottom: 10px; }
  .tp-rental-partner { display: flex; align-items: center; gap: 8px; padding: 8px 10px; background: #fff; border-radius: 8px; margin-bottom: 6px; font-size: 0.78rem; color: var(--ink); }
  .tp-search-btn { width: 100%; padding: 14px; background: var(--ink); color: #fff; border: none; border-radius: 10px; font-size: 0.95rem; font-weight: 500; font-family: var(--sans); cursor: pointer; transition: background 0.2s, transform 0.15s; margin-top: 4px; display: flex; align-items: center; justify-content: center; gap: 8px; }
  .tp-search-btn:hover { background: var(--accent); transform: translateY(-1px); }
  .tp-search-btn:disabled { background: var(--muted); cursor: not-allowed; transform: none; }
  .tp-section-divider { display: flex; align-items: center; gap: 10px; margin: 24px 0 18px; font-size: 0.72rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); }
  .tp-section-divider::before, .tp-section-divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .tp-my-trip { background: var(--paper); border: 1px solid var(--border); border-radius: 10px; padding: 14px; margin-bottom: 10px; cursor: pointer; transition: border-color 0.2s, box-shadow 0.2s; }
  .tp-my-trip:hover { border-color: var(--accent); box-shadow: 0 2px 12px rgba(26,107,74,0.08); }
  .tp-my-trip-route { font-size: 0.85rem; font-weight: 500; color: var(--ink); margin-bottom: 4px; }
  .tp-my-trip-meta { font-size: 0.72rem; color: var(--muted); }
  .tp-my-trip-badge { display: inline-block; margin-top: 8px; font-size: 0.65rem; font-weight: 500; padding: 3px 8px; border-radius: 100px; }
  .tp-badge-matched { background: #e8f5ef; color: var(--accent); }
  .tp-badge-pending { background: #fff4ee; color: var(--accent2); }
  .tp-results-panel { padding: 32px 36px; overflow-y: auto; }
  .tp-results-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
  .tp-results-title { font-family: var(--serif); font-size: 1.4rem; color: var(--ink); }
  .tp-results-count { font-size: 0.82rem; color: var(--muted); margin-top: 4px; }
  .tp-filters { display: flex; gap: 8px; margin-bottom: 28px; flex-wrap: wrap; }
  .tp-filter-chip { padding: 7px 16px; border-radius: 100px; border: 1px solid var(--border); background: var(--card); font-size: 0.78rem; color: var(--muted); cursor: pointer; font-family: var(--sans); transition: all 0.2s; }
  .tp-filter-chip:hover { border-color: var(--ink); color: var(--ink); }
  .tp-filter-chip.active { background: var(--ink); color: #fff; border-color: var(--ink); }
  .tp-cards-grid { display: flex; flex-direction: column; gap: 16px; }
  .tp-trip-card { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 24px; transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s; }
  .tp-trip-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.08); transform: translateY(-2px); border-color: #ccc; }
  .tp-trip-card.featured { border-color: var(--accent); }
  .tp-card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18px; }
  .tp-card-badge { font-size: 0.65rem; font-weight: 500; padding: 4px 10px; border-radius: 100px; letter-spacing: 0.06em; }
  .tp-card-badge-green { background: #e8f5ef; color: var(--accent); }
  .tp-card-badge-orange { background: #fff4ee; color: var(--accent2); }
  .tp-card-badge-blue { background: #eef1fd; color: #4a6ee8; }
  .tp-card-fare { text-align: right; }
  .tp-card-fare-amount { font-family: var(--serif); font-size: 1.5rem; color: var(--accent); line-height: 1; }
  .tp-card-fare-was { font-size: 0.7rem; color: var(--muted); text-decoration: line-through; }
  .tp-card-fare-label { font-size: 0.68rem; color: var(--muted); }
  .tp-card-route { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
  .tp-card-route-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--accent); flex-shrink: 0; }
  .tp-card-route-dot-end { width: 10px; height: 10px; border-radius: 50%; background: var(--accent2); flex-shrink: 0; }
  .tp-card-route-line { flex: 1; height: 1px; background: var(--border); position: relative; }
  .tp-card-route-line::after { content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 6px; height: 6px; border-radius: 50%; background: var(--border); border: 2px solid var(--card); }
  .tp-card-route-labels { display: flex; justify-content: space-between; font-size: 0.78rem; color: var(--muted); margin-bottom: 16px; }
  .tp-card-route-labels strong { color: var(--ink); font-size: 0.85rem; display: block; }
  .tp-card-travellers { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .tp-card-avatars { display: flex; align-items: center; }
  .tp-card-avatar { width: 32px; height: 32px; border-radius: 50%; border: 2px solid var(--card); display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: 500; color: #fff; margin-left: -8px; }
  .tp-card-avatar:first-child { margin-left: 0; }
  .tp-card-spots { font-size: 0.78rem; color: var(--muted); }
  .tp-card-spots strong { color: var(--accent); }
  .tp-card-vehicle-tag { display: flex; align-items: center; gap: 6px; font-size: 0.75rem; color: var(--muted); }
  .tp-card-info { display: flex; gap: 20px; padding-top: 16px; border-top: 1px solid var(--border); flex-wrap: wrap; }
  .tp-card-info-item { display: flex; align-items: center; gap: 6px; font-size: 0.75rem; color: var(--muted); }
  .tp-card-actions { display: flex; gap: 10px; margin-top: 16px; }
  .tp-card-btn-primary { flex: 1; padding: 10px; background: var(--ink); color: #fff; border: none; border-radius: 8px; font-size: 0.82rem; font-weight: 500; font-family: var(--sans); cursor: pointer; transition: background 0.2s; }
  .tp-card-btn-primary:hover { background: var(--accent); }
  .tp-card-btn-secondary { padding: 10px 16px; background: transparent; color: var(--ink); border: 1px solid var(--border); border-radius: 8px; font-size: 0.82rem; font-family: var(--sans); cursor: pointer; transition: border-color 0.2s; }
  .tp-card-btn-secondary:hover { border-color: var(--ink); }
  .tp-vehicle-owner-tag { font-size: 0.72rem; color: #4a6ee8; margin-bottom: 8px; font-weight: 500; }
  .tp-poi-alert { background: var(--ink); color: #fff; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px; display: flex; align-items: flex-start; gap: 14px; }
  .tp-poi-icon { font-size: 1.4rem; flex-shrink: 0; margin-top: 2px; }
  .tp-poi-label { font-size: 0.65rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: #6ec99a; margin-bottom: 4px; }
  .tp-poi-name { font-size: 0.95rem; font-weight: 500; margin-bottom: 4px; }
  .tp-poi-desc { font-size: 0.78rem; color: rgba(255,255,255,0.6); line-height: 1.5; }
  .tp-poi-close { margin-left: auto; color: rgba(255,255,255,0.4); cursor: pointer; font-size: 1rem; flex-shrink: 0; }
  .tp-poi-close:hover { color: #fff; }
  .tp-poi-loading { font-size: 0.78rem; color: rgba(255,255,255,0.5); }
  .tp-empty { text-align: center; padding: 80px 40px; color: var(--muted); }
  .tp-empty-icon { font-size: 3rem; margin-bottom: 16px; }
  .tp-empty-title { font-family: var(--serif); font-size: 1.4rem; color: var(--ink); margin-bottom: 8px; }
  .tp-empty-desc { font-size: 0.88rem; line-height: 1.6; }
  @keyframes shimmer { 0% { background-position: -600px 0; } 100% { background-position: 600px 0; } }
  .tp-skeleton { background: linear-gradient(90deg, #ece9e0 25%, #f5f2ea 50%, #ece9e0 75%); background-size: 600px 100%; animation: shimmer 1.4s infinite; border-radius: 8px; }
  .tp-skeleton-card { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 24px; margin-bottom: 16px; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .tp-spinner { width: 16px; height: 16px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; animation: spin 0.7s linear infinite; display: inline-block; }
  .tp-toast { position: fixed; bottom: 24px; right: 24px; z-index: 999; background: #1a6b4a; color: #fff; padding: 14px 20px; border-radius: 12px; font-size: 0.88rem; box-shadow: 0 8px 32px rgba(0,0,0,0.15); }
  .tp-error-banner { background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 12px 16px; font-size: 0.82rem; color: #d94040; margin-bottom: 16px; }
  .tp-payment-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 999; }
  .tp-payment-modal { background: #fff; border-radius: 16px; padding: 28px; width: 340px; box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
  .tp-payment-title { font-family: Georgia; font-size: 1.2rem; margin-bottom: 8px; color: #0d0d0d; }
  .tp-payment-sub { font-size: 0.82rem; color: #6b6b63; margin-bottom: 20px; }
  .tp-payment-box { background: #f0faf5; border-radius: 10px; padding: 16px; margin-bottom: 16px; }
  .tp-payment-box-title { font-size: 0.72rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.08em; color: #1a6b4a; margin-bottom: 10px; }
  .tp-payment-row { display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 6px; color: #6b6b63; }
  .tp-payment-row strong { color: #0d0d0d; }
  .tp-venmo-btn { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 12px; background: #3D95CE; color: #fff; border-radius: 8px; text-decoration: none; font-size: 0.88rem; font-weight: 500; margin-bottom: 8px; }
  .tp-zelle-row { display: flex; align-items: center; justify-content: space-between; padding: 12px; background: #6B1FD4; color: #fff; border-radius: 8px; margin-bottom: 8px; font-size: 0.82rem; }
  .tp-payment-close { width: 100%; padding: 12px; background: #0d0d0d; color: #fff; border: none; border-radius: 8px; cursor: pointer; font-size: 0.88rem; margin-top: 8px; font-family: sans-serif; }
`

const COLORS = ['#1a6b4a','#e8673a','#4a6ee8','#b84aaa','#e8b84a','#4ab8e8']

function fixDate(dateStr) {
  if (!dateStr) return ''
  const d = dateStr.includes('T') ? dateStr : dateStr + 'T12:00:00'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function fixDateShort(dateStr) {
  if (!dateStr) return ''
  const d = dateStr.includes('T') ? dateStr : dateStr + 'T12:00:00'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function getTripTypeLabel(type) {
  if (type === 'vehicle') return '🔑 Private vehicle'
  if (type === 'rental') return '🚗 Rental car'
  return '🚕 Rideshare'
}

function SkeletonCard() {
  return (
    <div className="tp-skeleton-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div className="tp-skeleton" style={{ width: 80, height: 20 }} />
        <div className="tp-skeleton" style={{ width: 60, height: 28 }} />
      </div>
      <div className="tp-skeleton" style={{ height: 12, marginBottom: 12 }} />
      <div className="tp-skeleton" style={{ height: 12, width: '70%', marginBottom: 20 }} />
      <div style={{ display: 'flex', gap: 8 }}>
        <div className="tp-skeleton" style={{ width: 32, height: 32, borderRadius: '50%' }} />
        <div className="tp-skeleton" style={{ width: 32, height: 32, borderRadius: '50%' }} />
        <div className="tp-skeleton" style={{ width: 32, height: 32, borderRadius: '50%' }} />
      </div>
    </div>
  )
}

function TripCard({ trip, onJoin, onChat, index }) {
  const memberCount = parseInt(trip.member_count) || 0
  const totalSeats = trip.total_seats || 4
  const availableSeats = trip.available_seats || 0
  const fare = parseFloat(trip.base_fare) || 0
  const isFirst = index === 0

  return (
    <div className={'tp-trip-card' + (isFirst ? ' featured' : '')}>
      <div className="tp-card-top">
        <div>
          {trip.trip_type === 'vehicle' && trip.vehicle_model && (
            <div className="tp-vehicle-owner-tag">🔑 Private vehicle · {trip.vehicle_model}</div>
          )}
          {trip.trip_type === 'rental' && (
            <div className="tp-vehicle-owner-tag" style={{ color: '#4a6ee8' }}>🚗 Group rental car</div>
          )}
          {trip.trip_type === 'vehicle' && (trip.venmo_handle || trip.zelle_handle) && (
            <div style={{ fontSize: '0.68rem', color: '#1a6b4a', marginBottom: 4 }}>💳 Venmo/Zelle accepted</div>
          )}
          <span className={'tp-card-badge ' + (isFirst ? 'tp-card-badge-green' : availableSeats === 1 ? 'tp-card-badge-orange' : 'tp-card-badge-blue')}>
            {isFirst ? 'Best match' : availableSeats === 1 ? '1 spot left' : availableSeats + ' spots left'}
          </span>
        </div>
        <div className="tp-card-fare">
          <div className="tp-card-fare-amount">${fare}</div>
          <div className="tp-card-fare-was">${(fare * 2.5).toFixed(0)}</div>
          <div className="tp-card-fare-label">per person</div>
        </div>
      </div>

      <div className="tp-card-route">
        <div className="tp-card-route-dot" />
        <div className="tp-card-route-line" />
        <div className="tp-card-route-dot-end" />
      </div>

      <div className="tp-card-route-labels">
        <div>
          <strong>{trip.from_city}</strong>
          {fixDateShort(trip.trip_date)} · {trip.departure_time?.slice(0,5)}
        </div>
        <div style={{ textAlign: 'right' }}>
          <strong>{trip.to_city}</strong>
          {getTripTypeLabel(trip.trip_type)}
        </div>
      </div>

      <div className="tp-card-travellers">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="tp-card-avatars">
            {Array.from({ length: Math.min(memberCount + 1, 4) }).map((_, i) => (
              <div key={i} className="tp-card-avatar" style={{ background: COLORS[i % COLORS.length] }}>
                {String.fromCharCode(65 + i)}
              </div>
            ))}
          </div>
          <div className="tp-card-spots">
            <strong>{availableSeats} spot{availableSeats !== 1 ? 's' : ''}</strong> left
          </div>
        </div>
        <div className="tp-card-vehicle-tag">
          {getTripTypeLabel(trip.trip_type)}
        </div>
      </div>

      <div className="tp-card-info">
        <div className="tp-card-info-item">👥 {totalSeats - availableSeats}/{totalSeats} joined</div>
        <div className="tp-card-info-item">🕐 {trip.departure_time?.slice(0,5)}</div>
        <div className="tp-card-info-item">📅 {fixDate(trip.trip_date)}</div>
        {trip.trip_type === 'vehicle' && <div className="tp-card-info-item">⛽ Fuel split included</div>}
        {trip.trip_type === 'rental' && <div className="tp-card-info-item">🚗 Rental cost split</div>}
        {trip.vehicle_mpg && trip.trip_type === 'vehicle' && <div className="tp-card-info-item">🛣 {trip.vehicle_mpg} mpg</div>}
      </div>

      <div className="tp-card-actions">
        <button className="tp-card-btn-primary" onClick={(e) => { e.stopPropagation(); onJoin(trip) }}>
          {availableSeats === 1 ? 'Join now' : 'Join trip'}
        </button>
        <button className="tp-card-btn-secondary" onClick={(e) => { e.stopPropagation(); onChat(trip) }}>
          Chat
        </button>
      </div>
    </div>
  )
}

export default function TripPlanning() {
  const navigate = useNavigate()
  const [search, setSearch] = useState({ from: '', to: '', date: '', passengers: '1' })
  const [tripType, setTripType] = useState('rideshare')
  const [vehicleModel, setVehicleModel] = useState('')
  const [vehicleMpg, setVehicleMpg] = useState('28')
  const [venmoHandle, setVenmoHandle] = useState('')
  const [zelleHandle, setZelleHandle] = useState('')
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [trips, setTrips] = useState([])
  const [myTrips, setMyTrips] = useState([])
  const [filter, setFilter] = useState('all')
  const [poiVisible, setPoiVisible] = useState(true)
  const [poi, setPoi] = useState(null)
  const [poiLoading, setPoiLoading] = useState(false)
  const [joinedTrip, setJoinedTrip] = useState(null)
  const [showPayment, setShowPayment] = useState(null)
  const [error, setError] = useState('')

  const user = JSON.parse(localStorage.getItem('dt_user') || '{}')
  const token = localStorage.getItem('dt_token')

  useEffect(function() {
    var el = document.createElement('style')
    el.innerHTML = styles
    document.head.appendChild(el)
    if (token) fetchMyTrips()
    return function() { document.head.removeChild(el) }
  }, [])

  async function fetchMyTrips() {
    try {
      const res = await fetch('http://localhost:4000/api/trips/my', { headers: { 'Authorization': 'Bearer ' + token } })
      const data = await res.json()
      if (res.ok) setMyTrips(data.trips || [])
    } catch (err) { console.error('Fetch my trips error:', err) }
  }

  async function fetchPOIAlerts(from, to) {
    setPoiLoading(true)
    setPoi(null)
    try {
      const res = await fetch('http://localhost:4000/api/ai/poi-alerts', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromCity: from, toCity: to })
      })
      const data = await res.json()
      if (res.ok && data.pois && data.pois.length > 0) {
        setPoi(data.pois[0])
      }
    } catch (err) {
      console.error('POI error:', err)
    } finally {
      setPoiLoading(false)
    }
  }

  async function handleSearch() {
    if (!search.from || !search.to || !search.date) {
      setError('Please fill in From, To and Date fields')
      return
    }
    setError('')
    setLoading(true)
    setSearched(false)
    setPoi(null)
    setPoiVisible(true)
    try {
      const tripDate = new Date(search.date + 'T12:00:00').toISOString().slice(0, 10)
      const params = new URLSearchParams({ fromCity: search.from, toCity: search.to, tripDate: tripDate })
      const res = await fetch('http://localhost:4000/api/trips/search?' + params, { headers: { 'Authorization': 'Bearer ' + token } })
      const data = await res.json()
      if (res.ok) {
        setTrips(data.trips || [])
        setSearched(true)
        fetchPOIAlerts(search.from, search.to)
      } else {
        setError(data.error || 'Search failed')
      }
    } catch (err) { setError('Connection error') }
    finally { setLoading(false) }
  }

  async function handleJoin(trip) {
    try {
      const res = await fetch('http://localhost:4000/api/trips/' + trip.id + '/join', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token }
      })
      const data = await res.json()
      if (res.ok) {
        if (trip.trip_type === 'vehicle' && (trip.venmo_handle || trip.zelle_handle)) {
          setShowPayment(trip)
        } else {
          setJoinedTrip(trip)
          setTimeout(function() { setJoinedTrip(null) }, 3000)
        }
        handleSearch()
        fetchMyTrips()
      } else {
        setError(data.error || 'Failed to join trip')
      }
    } catch (err) { setError('Connection error') }
  }

  async function handleCreateTrip() {
    if (!search.from || !search.to || !search.date) {
      setError('Please fill in From, To and Date to create a trip')
      return
    }
    try {
      const tripDate = new Date(search.date + 'T12:00:00').toISOString().slice(0, 10)
      const res = await fetch('http://localhost:4000/api/trips', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromCity: search.from,
          toCity: search.to,
          tripDate: tripDate,
          departureTime: '08:00',
          totalSeats: parseInt(search.passengers) + 1,
          tripType: tripType,
          baseFare: 85,
          vehicleModel: vehicleModel || null,
          vehicleMpg: parseInt(vehicleMpg) || 28,
          venmoHandle: venmoHandle || null,
          zelleHandle: zelleHandle || null,
        })
      })
      const data = await res.json()
      if (res.ok) {
        setJoinedTrip({ from_city: search.from, to_city: search.to })
        setTimeout(function() { setJoinedTrip(null) }, 3000)
        handleSearch()
        fetchMyTrips()
      } else {
        setError(data.error || 'Failed to create trip')
      }
    } catch (err) { setError('Connection error') }
  }

  function handleChat(trip) { navigate('/chat') }

  var filteredTrips = trips.filter(function(t) {
    if (filter === 'rideshare') return t.trip_type === 'rideshare'
    if (filter === 'vehicle') return t.trip_type === 'vehicle'
    if (filter === 'rental') return t.trip_type === 'rental'
    return true
  })

  function set(k, v) {
    setSearch(function(s) { return Object.assign({}, s, { [k]: v }) })
    setError('')
  }

  var userInitials = user.firstName ? (user.firstName[0] + (user.lastName ? user.lastName[0] : '')).toUpperCase() : 'U'

  return (
    <>
      {joinedTrip && (
        <div className="tp-toast">
          Joined {joinedTrip.from_city} to {joinedTrip.to_city}! Check your chat.
        </div>
      )}

      {showPayment && (
        <div className="tp-payment-overlay" onClick={function() { setShowPayment(null) }}>
          <div className="tp-payment-modal" onClick={function(e) { e.stopPropagation() }}>
            <div className="tp-payment-title">You joined the trip!</div>
            <div className="tp-payment-sub">{showPayment.from_city} to {showPayment.to_city} · {showPayment.vehicle_model || 'Private vehicle'}</div>
            <div className="tp-payment-box">
              <div className="tp-payment-box-title">Fuel split — pay the driver</div>
              <div className="tp-payment-row"><span>Your share</span><strong style={{ color: '#1a6b4a' }}>${showPayment.base_fare}</strong></div>
              <div className="tp-payment-row"><span>Vehicle</span><strong>{showPayment.vehicle_model || 'Private car'}</strong></div>
              <div className="tp-payment-row"><span>Fuel efficiency</span><strong>{showPayment.vehicle_mpg || 28} mpg</strong></div>
            </div>
            {showPayment.venmo_handle && (
              <a href={'https://venmo.com/' + showPayment.venmo_handle.replace('@','') + '?txn=pay&amount=' + showPayment.base_fare + '&note=' + encodeURIComponent(showPayment.from_city + ' to ' + showPayment.to_city + ' fuel split')}
                target="_blank" rel="noreferrer" className="tp-venmo-btn">
                💙 Pay via Venmo — {showPayment.venmo_handle}
              </a>
            )}
            {showPayment.zelle_handle && (
              <div className="tp-zelle-row">
                <span style={{ fontWeight: 500 }}>💜 Pay via Zelle</span>
                <span>{showPayment.zelle_handle}</span>
              </div>
            )}
            {!showPayment.venmo_handle && !showPayment.zelle_handle && (
              <div style={{ background: '#f7f5f0', borderRadius: 8, padding: 12, fontSize: '0.82rem', color: '#6b6b63', marginBottom: 8 }}>
                Contact the driver directly to arrange payment.
              </div>
            )}
            <button className="tp-payment-close" onClick={function() { setShowPayment(null) }}>Done</button>
          </div>
        </div>
      )}

      <div className="tp-body">
        <nav className="tp-nav">
          <Link to="/" className="tp-nav-logo">Destination<span>Together</span></Link>
          <div className="tp-nav-right">
            <Link to="/" className="tp-nav-link">Home</Link>
            <Link to="/profile" className="tp-nav-link">Profile</Link>
            <div className="tp-nav-avatar">{userInitials}</div>
          </div>
        </nav>

        <div className="tp-layout">
          <div className="tp-search-panel">
            <div className="tp-panel-title">Find a trip</div>
            <div className="tp-panel-sub">Search for travelers heading your way</div>

            {error && <div className="tp-error-banner">{error}</div>}

            <div className="tp-field">
              <label className="tp-label">From</label>
              <div className="tp-input-icon-wrap">
                <span className="tp-input-icon">📍</span>
                <input className="tp-input tp-input-with-icon" placeholder="e.g. New York" value={search.from} onChange={function(e) { set('from', e.target.value) }} />
              </div>
            </div>

            <div className="tp-field">
              <label className="tp-label">To</label>
              <div className="tp-input-icon-wrap">
                <span className="tp-input-icon">🏁</span>
                <input className="tp-input tp-input-with-icon" placeholder="e.g. Miami" value={search.to} onChange={function(e) { set('to', e.target.value) }} />
              </div>
            </div>

            <div className="tp-row">
              <div className="tp-field">
                <label className="tp-label">Date</label>
                <input className="tp-input" type="date" value={search.date} onChange={function(e) { set('date', e.target.value) }} />
              </div>
              <div className="tp-field">
                <label className="tp-label">Passengers</label>
                <select className="tp-select" value={search.passengers} onChange={function(e) { set('passengers', e.target.value) }}>
                  <option value="1">1 passenger</option>
                  <option value="2">2 passengers</option>
                  <option value="3">3 passengers</option>
                  <option value="4">4 passengers</option>
                  <option value="5">5 passengers</option>
                  <option value="6">6 passengers</option>
                </select>
              </div>
            </div>

            <div className="tp-field">
              <label className="tp-label">Trip type</label>
              <select className="tp-select" value={tripType} onChange={function(e) { setTripType(e.target.value) }}>
                <option value="rideshare">🚕 Rideshare (Uber / Lyft)</option>
                <option value="rental">🚗 Rental car (Enterprise, Hertz, Budget)</option>
                <option value="vehicle">🔑 My own vehicle</option>
              </select>
            </div>

            {tripType === 'rental' && (
              <div className="tp-rental-box">
                <div className="tp-rental-box-title">🚗 Rental car partners</div>
                <div className="tp-rental-partner">🟡 Enterprise — Group rates available</div>
                <div className="tp-rental-partner">🟢 Hertz — Split cost with group</div>
                <div className="tp-rental-partner">🔵 Budget — Affordable group rentals</div>
                <div style={{ fontSize: '0.72rem', color: '#4a6ee8', marginTop: 8 }}>
                  Create the trip and coordinate booking details in the group chat.
                </div>
              </div>
            )}

            {tripType === 'vehicle' && (
              <div className="tp-vehicle-box">
                <div className="tp-vehicle-box-title">🔑 Vehicle details</div>
                <div className="tp-field">
                  <label className="tp-label">Vehicle model</label>
                  <input className="tp-input" placeholder="e.g. Toyota Camry, Tesla Model 3" value={vehicleModel} onChange={function(e) { setVehicleModel(e.target.value) }} />
                </div>
                <div className="tp-field">
                  <label className="tp-label">Fuel efficiency (MPG)</label>
                  <input className="tp-input" type="number" placeholder="e.g. 28" value={vehicleMpg} onChange={function(e) { setVehicleMpg(e.target.value) }} />
                </div>
                <div className="tp-field">
                  <label className="tp-label">Venmo handle (optional)</label>
                  <input className="tp-input" placeholder="@yourvenmo" value={venmoHandle} onChange={function(e) { setVenmoHandle(e.target.value) }} />
                </div>
                <div className="tp-field" style={{ marginBottom: 0 }}>
                  <label className="tp-label">Zelle (phone or email)</label>
                  <input className="tp-input" placeholder="your@email.com or phone" value={zelleHandle} onChange={function(e) { setZelleHandle(e.target.value) }} />
                </div>
              </div>
            )}

            <button className="tp-search-btn" onClick={handleSearch} disabled={loading}>
              {loading ? <span className="tp-spinner" /> : 'Search trips'}
            </button>

            <div className="tp-section-divider">My trips</div>

            {myTrips.length === 0 && (
              <div style={{ fontSize: '0.78rem', color: 'var(--muted)', textAlign: 'center', padding: '12px 0' }}>
                No trips yet. Search and join one!
              </div>
            )}

            {myTrips.map(function(t) {
              return (
                <div className="tp-my-trip" key={t.id} onClick={function() {
                  set('from', t.from_city)
                  set('to', t.to_city)
                  set('date', t.trip_date ? t.trip_date.slice(0,10) : '')
                }}>
                  <div className="tp-my-trip-route">{t.from_city} to {t.to_city}</div>
                  <div className="tp-my-trip-meta">{fixDateShort(t.trip_date)} · {getTripTypeLabel(t.trip_type)}</div>
                  <span className={'tp-my-trip-badge ' + (t.status === 'active' ? 'tp-badge-matched' : 'tp-badge-pending')}>
                    {t.status === 'active' ? 'Active' : t.status}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="tp-results-panel">

            {searched && poiVisible && (
              <div className="tp-poi-alert">
                <div className="tp-poi-icon">🤖</div>
                <div style={{ flex: 1 }}>
                  {poiLoading ? (
                    <>
                      <div className="tp-poi-label">AI suggestion · Loading...</div>
                      <div className="tp-poi-loading">Finding interesting stops on your route...</div>
                    </>
                  ) : poi ? (
                    <>
                      <div className="tp-poi-label">AI suggestion · {poi.category} · {poi.detour}</div>
                      <div className="tp-poi-name">{poi.name}</div>
                      <div className="tp-poi-desc">{poi.description}</div>
                    </>
                  ) : (
                    <>
                      <div className="tp-poi-label">AI suggestion · On your route</div>
                      <div className="tp-poi-name">Explore your route</div>
                      <div className="tp-poi-desc">No suggestions available for this route right now.</div>
                    </>
                  )}
                </div>
                <div className="tp-poi-close" onClick={function() { setPoiVisible(false) }}>✕</div>
              </div>
            )}

            <div className="tp-results-header">
              <div>
                <div className="tp-results-title">
                  {!searched ? 'Find your trip' : filteredTrips.length + ' trips found'}
                </div>
                {searched && search.from && (
                  <div className="tp-results-count">{search.from} to {search.to} · {search.date}</div>
                )}
              </div>
            </div>

            {searched && (
              <div className="tp-filters">
                {[
                  { key: 'all', label: 'All trips' },
                  { key: 'rideshare', label: '🚕 Rideshare' },
                  { key: 'rental', label: '🚗 Rental' },
                  { key: 'vehicle', label: '🔑 Private vehicle' },
                ].map(function(f) {
                  return (
                    <button key={f.key} className={'tp-filter-chip' + (filter === f.key ? ' active' : '')} onClick={function() { setFilter(f.key) }}>
                      {f.label}
                    </button>
                  )
                })}
              </div>
            )}

            {loading && (
              <div><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>
            )}

            {!loading && searched && filteredTrips.length > 0 && (
              <div className="tp-cards-grid">
                {filteredTrips.map(function(trip, i) {
                  return <TripCard key={trip.id} trip={trip} index={i} onJoin={handleJoin} onChat={handleChat} />
                })}
              </div>
            )}

            {!loading && searched && filteredTrips.length === 0 && (
              <div className="tp-empty">
                <div className="tp-empty-icon">🗺️</div>
                <div className="tp-empty-title">No trips found</div>
                <div className="tp-empty-desc">No one is heading that way yet.<br />Be the first to create this trip!</div>
                <button className="tp-search-btn" style={{ maxWidth: 220, margin: '24px auto 0' }} onClick={handleCreateTrip}>
                  + Create this trip
                </button>
              </div>
            )}

            {!loading && !searched && (
              <div className="tp-empty">
                <div className="tp-empty-icon">✈️</div>
                <div className="tp-empty-title">Where are you headed?</div>
                <div className="tp-empty-desc">Enter your origin, destination and date to find travelers going your way.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}