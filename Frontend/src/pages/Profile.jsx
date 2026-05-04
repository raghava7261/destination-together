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
  .pr-body { background: var(--paper); font-family: var(--sans); min-height: 100vh; color: var(--ink); }
  .pr-nav { position: sticky; top: 0; z-index: 100; padding: 16px 48px; display: flex; align-items: center; justify-content: space-between; background: rgba(247,245,240,0.95); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border); }
  .pr-nav-logo { font-family: var(--serif); font-size: 1.2rem; color: var(--ink); text-decoration: none; }
  .pr-nav-logo span { color: var(--accent); }
  .pr-nav-right { display: flex; align-items: center; gap: 20px; }
  .pr-nav-link { font-size: 0.85rem; color: var(--muted); text-decoration: none; transition: color 0.2s; }
  .pr-nav-link:hover { color: var(--ink); }
  .pr-nav-btn { padding: 9px 20px; background: var(--ink); color: #fff; border-radius: 100px; font-size: 0.82rem; font-weight: 500; text-decoration: none; transition: background 0.2s; }
  .pr-nav-btn:hover { background: var(--accent); }
  .pr-layout { max-width: 1100px; margin: 0 auto; padding: 40px 48px; display: grid; grid-template-columns: 300px 1fr; gap: 32px; }
  .pr-card { background: var(--card); border: 1px solid var(--border); border-radius: 20px; overflow: hidden; }
  .pr-card-cover { height: 80px; background: var(--ink); position: relative; }
  .pr-card-cover-pattern { position: absolute; inset: 0; opacity: 0.15; background-image: radial-gradient(circle at 20% 50%, #1a6b4a 0%, transparent 50%), radial-gradient(circle at 80% 20%, #e8673a 0%, transparent 40%); }
  .pr-card-body { padding: 0 24px 24px; }
  .pr-avatar-wrap { margin-top: -32px; margin-bottom: 14px; position: relative; display: inline-block; }
  .pr-avatar { width: 64px; height: 64px; border-radius: 50%; background: var(--accent); border: 3px solid var(--card); display: flex; align-items: center; justify-content: center; font-family: var(--serif); font-size: 1.4rem; color: #fff; }
  .pr-online-badge { position: absolute; bottom: 2px; right: 2px; width: 14px; height: 14px; border-radius: 50%; background: #22c55e; border: 2px solid var(--card); }
  .pr-name { font-family: var(--serif); font-size: 1.3rem; color: var(--ink); margin-bottom: 2px; }
  .pr-handle { font-size: 0.78rem; color: var(--muted); margin-bottom: 12px; }
  .pr-location { font-size: 0.78rem; color: var(--muted); display: flex; align-items: center; gap: 6px; margin-bottom: 16px; }
  .pr-edit-btn { width: 100%; padding: 10px; border: 1px solid var(--border); border-radius: 8px; background: transparent; font-size: 0.82rem; color: var(--ink); font-family: var(--sans); cursor: pointer; transition: all 0.2s; margin-bottom: 20px; }
  .pr-edit-btn:hover { border-color: var(--ink); }
  .pr-logout-btn { width: 100%; padding: 10px; border: 1px solid #fecaca; border-radius: 8px; background: transparent; font-size: 0.82rem; color: #d94040; font-family: var(--sans); cursor: pointer; transition: all 0.2s; margin-bottom: 20px; }
  .pr-logout-btn:hover { background: #fef2f2; }
  .pr-trust { background: var(--paper); border-radius: 12px; padding: 16px; margin-bottom: 16px; }
  .pr-trust-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .pr-trust-label { font-size: 0.72rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); }
  .pr-trust-score { font-family: var(--serif); font-size: 1.8rem; color: var(--accent); line-height: 1; }
  .pr-trust-score span { font-size: 0.9rem; color: var(--muted); }
  .pr-trust-bar-track { height: 6px; background: var(--border); border-radius: 100px; overflow: hidden; margin-bottom: 8px; }
  .pr-trust-bar-fill { height: 100%; background: var(--accent); border-radius: 100px; width: 87%; }
  .pr-trust-desc { font-size: 0.72rem; color: var(--muted); }
  .pr-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; margin-bottom: 16px; }
  .pr-stat { background: var(--card); padding: 14px 10px; text-align: center; }
  .pr-stat-num { font-family: var(--serif); font-size: 1.3rem; color: var(--ink); line-height: 1; margin-bottom: 4px; }
  .pr-stat-num span { color: var(--accent); }
  .pr-stat-label { font-size: 0.65rem; color: var(--muted); }
  .pr-badges-title { font-size: 0.72rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); margin-bottom: 10px; }
  .pr-badges { display: flex; flex-wrap: wrap; gap: 6px; }
  .pr-badge { padding: 5px 10px; border-radius: 100px; font-size: 0.68rem; font-weight: 500; display: flex; align-items: center; gap: 4px; }
  .pr-badge-green { background: #e8f5ef; color: var(--accent); }
  .pr-badge-blue { background: #eef1fd; color: #4a6ee8; }
  .pr-badge-orange { background: #fff4ee; color: var(--accent2); }
  .pr-right { display: flex; flex-direction: column; gap: 24px; }
  .pr-tabs { display: flex; gap: 0; border-bottom: 1px solid var(--border); }
  .pr-tab { padding: 12px 20px; font-size: 0.85rem; color: var(--muted); border: none; background: transparent; font-family: var(--sans); cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1px; transition: color 0.2s, border-color 0.2s; }
  .pr-tab.active { color: var(--ink); border-bottom-color: var(--ink); font-weight: 500; }
  .pr-tab:hover { color: var(--ink); }
  .pr-section-title { font-family: var(--serif); font-size: 1.2rem; color: var(--ink); margin-bottom: 16px; }
  .pr-trip-card { background: var(--card); border: 1px solid var(--border); border-radius: 14px; padding: 20px; margin-bottom: 12px; transition: box-shadow 0.2s; }
  .pr-trip-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
  .pr-trip-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; }
  .pr-trip-route { font-size: 0.95rem; font-weight: 500; color: var(--ink); }
  .pr-trip-date { font-size: 0.72rem; color: var(--muted); margin-top: 3px; }
  .pr-trip-status { font-size: 0.65rem; font-weight: 500; padding: 4px 10px; border-radius: 100px; }
  .pr-status-active { background: #e8f5ef; color: var(--accent); }
  .pr-status-completed { background: #f0ede6; color: var(--muted); }
  .pr-trip-meta { display: flex; gap: 20px; flex-wrap: wrap; }
  .pr-trip-meta-item { font-size: 0.75rem; color: var(--muted); display: flex; align-items: center; gap: 5px; }
  .pr-trip-meta-item strong { color: var(--ink); }
  .pr-empty { text-align: center; padding: 40px; color: var(--muted); font-size: 0.85rem; }
  .pr-settings-section { background: var(--card); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; margin-bottom: 16px; }
  .pr-settings-header { padding: 16px 20px; border-bottom: 1px solid var(--border); font-size: 0.82rem; font-weight: 500; color: var(--ink); }
  .pr-settings-item { padding: 14px 20px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
  .pr-settings-item:last-child { border-bottom: none; }
  .pr-settings-label { font-size: 0.82rem; color: var(--ink); }
  .pr-settings-sub { font-size: 0.72rem; color: var(--muted); margin-top: 2px; }
  .pr-settings-value { font-size: 0.78rem; color: var(--muted); }
  .pr-settings-toggle { position: relative; width: 36px; height: 20px; }
  .pr-settings-toggle input { opacity: 0; width: 0; height: 0; }
  .pr-settings-track { position: absolute; inset: 0; background: var(--border); border-radius: 100px; cursor: pointer; transition: background 0.2s; }
  .pr-settings-toggle input:checked + .pr-settings-track { background: var(--accent); }
  .pr-settings-thumb { position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; background: #fff; border-radius: 50%; transition: transform 0.2s; pointer-events: none; }
  .pr-settings-toggle input:checked ~ .pr-settings-thumb { transform: translateX(16px); }
  @keyframes spin { to { transform: rotate(360deg); } }
  .pr-spinner { width: 24px; height: 24px; border-radius: 50%; border: 2px solid var(--border); border-top-color: var(--accent); animation: spin 0.7s linear infinite; margin: 40px auto; }
`

export default function Profile() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('trips')
  const [profile, setProfile] = useState(null)
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [notifs, setNotifs] = useState(true)
  const [matching, setMatching] = useState(true)
  const [location, setLocation] = useState(false)

  const token = localStorage.getItem('dt_token')
  const user = JSON.parse(localStorage.getItem('dt_user') || '{}')

  useEffect(function() {
    var el = document.createElement('style')
    el.innerHTML = styles
    document.head.appendChild(el)
    fetchProfile()
    fetchTrips()
    return function() { document.head.removeChild(el) }
  }, [])

  async function fetchProfile() {
    try {
      const res = await fetch('/api/auth/profile', {
        headers: { 'Authorization': 'Bearer ' + token }
      })
      const data = await res.json()
      if (res.ok) setProfile(data.user)
    } catch (err) {
      console.error('Fetch profile error:', err)
    } finally {
      setLoading(false)
    }
  }

  async function fetchTrips() {
    try {
      const res = await fetch('/api/trips/my', {
        headers: { 'Authorization': 'Bearer ' + token }
      })
      const data = await res.json()
      if (res.ok) setTrips(data.trips || [])
    } catch (err) {
      console.error('Fetch trips error:', err)
    }
  }

  function handleLogout() {
    localStorage.removeItem('dt_token')
    localStorage.removeItem('dt_user')
    navigate('/login')
  }

  var displayName = profile
    ? (profile.first_name + ' ' + profile.last_name)
    : (user.firstName + ' ' + (user.lastName || ''))
  var initials = displayName.trim().split(' ').map(function(n) { return n[0] }).join('').toUpperCase().slice(0,2)

  return (
    <div className="pr-body">
      <nav className="pr-nav">
        <Link to="/" className="pr-nav-logo">Destination<span>Together</span></Link>
        <div className="pr-nav-right">
          <Link to="/trips" className="pr-nav-link">Find trips</Link>
          <Link to="/chat/1" className="pr-nav-link">Messages</Link>
          <Link to="/trips" className="pr-nav-btn">Plan a trip</Link>
        </div>
      </nav>

      <div className="pr-layout">

        {/* LEFT PROFILE CARD */}
        <div>
          {loading ? (
            <div className="pr-spinner" />
          ) : (
            <div className="pr-card">
              <div className="pr-card-cover">
                <div className="pr-card-cover-pattern" />
              </div>
              <div className="pr-card-body">
                <div className="pr-avatar-wrap">
                  <div className="pr-avatar">{initials}</div>
                  <div className="pr-online-badge" />
                </div>
                <div className="pr-name">{displayName}</div>
                <div className="pr-handle">@{profile?.email?.split('@')[0] || user.email?.split('@')[0]} · {profile?.city || user.city || 'Unknown city'}</div>
                <div className="pr-location">📍 {profile?.city || 'City not set'} · Member since {new Date(profile?.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</div>
                <button className="pr-edit-btn">Edit profile</button>
                <button className="pr-logout-btn" onClick={handleLogout}>Sign out</button>

                <div className="pr-trust">
                  <div className="pr-trust-header">
                    <div className="pr-trust-label">Trust score</div>
                    <div className="pr-trust-score">87<span>/100</span></div>
                  </div>
                  <div className="pr-trust-bar-track">
                    <div className="pr-trust-bar-fill" />
                  </div>
                  <div className="pr-trust-desc">Verified account · {trips.length} trips completed</div>
                </div>

                <div className="pr-stats">
                  <div className="pr-stat">
                    <div className="pr-stat-num">{trips.length}</div>
                    <div className="pr-stat-label">Trips</div>
                  </div>
                  <div className="pr-stat">
                    <div className="pr-stat-num">4.8<span>★</span></div>
                    <div className="pr-stat-label">Rating</div>
                  </div>
                  <div className="pr-stat">
                    <div className="pr-stat-num">$<span>{trips.length * 85}</span></div>
                    <div className="pr-stat-label">Saved</div>
                  </div>
                </div>

                <div style={{ marginTop: 16 }}>
                  <div className="pr-badges-title">Badges</div>
                  <div className="pr-badges">
                    <span className="pr-badge pr-badge-green">✓ ID Verified</span>
                    {trips.length >= 5 && <span className="pr-badge pr-badge-blue">🏆 Top Traveler</span>}
                    <span className="pr-badge pr-badge-orange">💬 Quick Responder</span>
                    {profile?.travel_style && <span className="pr-badge pr-badge-green">{profile.travel_style}</span>}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT TABS */}
        <div className="pr-right">
          <div className="pr-tabs">
            {[
              { key: 'trips', label: 'Trips (' + trips.length + ')' },
              { key: 'settings', label: 'Settings' },
            ].map(function(t) {
              return (
                <button key={t.key} className={'pr-tab' + (activeTab === t.key ? ' active' : '')} onClick={function() { setActiveTab(t.key) }}>
                  {t.label}
                </button>
              )
            })}
          </div>

          <div style={{ paddingTop: 24 }}>

            {/* TRIPS TAB */}
            {activeTab === 'trips' && (
              <div>
                <div className="pr-section-title">Your trips</div>
                {trips.length === 0 && (
                  <div className="pr-empty">
                    No trips yet. <Link to="/trips" style={{ color: 'var(--accent)' }}>Find one!</Link>
                  </div>
                )}
                {trips.map(function(trip) {
                  return (
                    <div key={trip.id} className="pr-trip-card">
                      <div className="pr-trip-top">
                        <div>
                          <div className="pr-trip-route">{trip.from_city} to {trip.to_city}</div>
                          <div className="pr-trip-date">{new Date(trip.trip_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                        </div>
                        <span className={'pr-trip-status ' + (trip.status === 'active' ? 'pr-status-active' : 'pr-status-completed')}>
                          {trip.status === 'active' ? 'Active' : 'Completed'}
                        </span>
                      </div>
                      <div className="pr-trip-meta">
                        <div className="pr-trip-meta-item">💰 <strong>${trip.base_fare}</strong> fare</div>
                        <div className="pr-trip-meta-item">👥 <strong>{trip.total_seats - trip.available_seats}/{trip.total_seats}</strong> seats</div>
                        <div className="pr-trip-meta-item">🕐 <strong>{trip.departure_time?.slice(0,5)}</strong></div>
                        <div className="pr-trip-meta-item">🚕 <strong>{trip.trip_type}</strong></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
              <div>
                <div className="pr-settings-section">
                  <div className="pr-settings-header">Account</div>
                  <div className="pr-settings-item">
                    <div>
                      <div className="pr-settings-label">Email</div>
                      <div className="pr-settings-sub">{profile?.email || user.email}</div>
                    </div>
                    <div className="pr-settings-value">Change</div>
                  </div>
                  <div className="pr-settings-item">
                    <div>
                      <div className="pr-settings-label">Phone</div>
                      <div className="pr-settings-sub">{profile?.phone || 'Not set'}</div>
                    </div>
                    <div className="pr-settings-value">Change</div>
                  </div>
                  <div className="pr-settings-item">
                    <div>
                      <div className="pr-settings-label">City</div>
                      <div className="pr-settings-sub">{profile?.city || 'Not set'}</div>
                    </div>
                    <div className="pr-settings-value">Edit</div>
                  </div>
                  <div className="pr-settings-item">
                    <div>
                      <div className="pr-settings-label">Travel style</div>
                      <div className="pr-settings-sub">{profile?.travel_style || 'Not set'}</div>
                    </div>
                    <div className="pr-settings-value">Edit</div>
                  </div>
                </div>

                <div className="pr-settings-section">
                  <div className="pr-settings-header">Preferences</div>
                  <div className="pr-settings-item">
                    <div>
                      <div className="pr-settings-label">Trip match notifications</div>
                      <div className="pr-settings-sub">Get notified when someone matches your route</div>
                    </div>
                    <label className="pr-settings-toggle">
                      <input type="checkbox" checked={notifs} onChange={function(e) { setNotifs(e.target.checked) }} />
                      <div className="pr-settings-track" />
                      <div className="pr-settings-thumb" />
                    </label>
                  </div>
                  <div className="pr-settings-item">
                    <div>
                      <div className="pr-settings-label">Auto matching</div>
                      <div className="pr-settings-sub">Automatically suggest matches for saved routes</div>
                    </div>
                    <label className="pr-settings-toggle">
                      <input type="checkbox" checked={matching} onChange={function(e) { setMatching(e.target.checked) }} />
                      <div className="pr-settings-track" />
                      <div className="pr-settings-thumb" />
                    </label>
                  </div>
                  <div className="pr-settings-item">
                    <div>
                      <div className="pr-settings-label">Share live location</div>
                      <div className="pr-settings-sub">Share location with trip group during travel</div>
                    </div>
                    <label className="pr-settings-toggle">
                      <input type="checkbox" checked={location} onChange={function(e) { setLocation(e.target.checked) }} />
                      <div className="pr-settings-track" />
                      <div className="pr-settings-thumb" />
                    </label>
                  </div>
                </div>

                <div className="pr-settings-section">
                  <div className="pr-settings-header">Danger zone</div>
                  <div className="pr-settings-item">
                    <div>
                      <div className="pr-settings-label" style={{ color: '#d94040' }}>Sign out</div>
                      <div className="pr-settings-sub">Sign out of your account</div>
                    </div>
                    <div className="pr-settings-value" style={{ color: '#d94040', cursor: 'pointer' }} onClick={handleLogout}>Sign out</div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  )
}