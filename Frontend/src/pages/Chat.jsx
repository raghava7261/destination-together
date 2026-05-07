import { useState, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'

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
  .ch-body { background: #f7f5f0; font-family: var(--sans); height: 100vh; display: flex; flex-direction: column; color: #0d0d0d; overflow: hidden; }
  .ch-nav { padding: 14px 32px; display: flex; align-items: center; justify-content: space-between; background: var(--card); border-bottom: 1px solid var(--border); flex-shrink: 0; }
  .ch-nav-logo { font-family: var(--serif); font-size: 1.1rem; color: var(--ink); text-decoration: none; }
  .ch-nav-logo span { color: var(--accent); }
  .ch-nav-right { display: flex; align-items: center; gap: 16px; }
  .ch-nav-link { font-size: 0.82rem; color: var(--muted); text-decoration: none; }
  .ch-nav-avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--ink); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.68rem; font-weight: 500; cursor: pointer; }
  .ch-layout { display: grid; grid-template-columns: 300px 1fr 280px; flex: 1; overflow: hidden; min-height: 0; }
  .ch-sidebar { background: var(--card); border-right: 1px solid var(--border); display: flex; flex-direction: column; overflow: hidden; }
  .ch-sidebar-header { padding: 20px 20px 12px; border-bottom: 1px solid var(--border); }
  .ch-sidebar-title { font-family: var(--serif); font-size: 1.1rem; color: var(--ink); margin-bottom: 12px; }
  .ch-search { width: 100%; padding: 9px 14px; border: 1px solid var(--border); border-radius: 8px; font-size: 0.82rem; font-family: var(--sans); background: var(--paper); color: var(--ink); outline: none; }
  .ch-search:focus { border-color: var(--accent); }
  .ch-search::placeholder { color: #b0aea7; }
  .ch-conv-list { flex: 1; overflow-y: auto; }
  .ch-conv-item { padding: 14px 20px; cursor: pointer; border-bottom: 1px solid var(--border); transition: background 0.15s; }
  .ch-conv-item:hover { background: var(--paper); }
  .ch-conv-item.active { background: #f0faf5; border-left: 3px solid var(--accent); }
  .ch-conv-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px; }
  .ch-conv-name { font-size: 0.85rem; font-weight: 500; color: var(--ink); }
  .ch-conv-time { font-size: 0.68rem; color: var(--muted); }
  .ch-conv-preview { font-size: 0.75rem; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 6px; }
  .ch-conv-meta { display: flex; align-items: center; justify-content: space-between; }
  .ch-conv-badge { font-size: 0.62rem; font-weight: 500; padding: 2px 7px; border-radius: 100px; }
  .ch-badge-trip { background: #e8f5ef; color: var(--accent); }
  .ch-badge-dm { background: #eef1fd; color: #4a6ee8; }
  .ch-main { display: flex; flex-direction: column; overflow: hidden; }
  .ch-chat-header { padding: 16px 24px; background: var(--card); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
  .ch-chat-header-left { display: flex; align-items: center; gap: 12px; }
  .ch-chat-avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--accent); display: flex; align-items: center; justify-content: center; font-size: 0.68rem; font-weight: 500; color: #fff; }
  .ch-chat-title { font-size: 0.95rem; font-weight: 500; color: var(--ink); }
  .ch-chat-subtitle { font-size: 0.72rem; color: var(--muted); margin-top: 2px; }
  .ch-chat-actions { display: flex; gap: 8px; }
  .ch-chat-action-btn { padding: 8px 14px; border: 1px solid var(--border); border-radius: 8px; background: var(--card); font-size: 0.78rem; color: var(--ink); font-family: var(--sans); cursor: pointer; transition: background 0.15s; }
  .ch-chat-action-btn:hover { background: var(--paper); }
  .ch-messages { flex: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 16px; }
  .ch-date-divider { text-align: center; font-size: 0.68rem; color: var(--muted); margin: 8px 0; }
  .ch-msg-row { display: flex; gap: 10px; align-items: flex-end; }
  .ch-msg-row.mine { flex-direction: row-reverse; }
  .ch-msg-avatar { width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 0.6rem; font-weight: 500; color: #fff; background: var(--accent); }
  .ch-msg-content { max-width: 68%; }
  .ch-msg-row.mine .ch-msg-content { align-items: flex-end; display: flex; flex-direction: column; }
  .ch-msg-sender { font-size: 0.68rem; color: var(--muted); margin-bottom: 4px; }
  .ch-msg-bubble { padding: 10px 14px; border-radius: 16px; font-size: 0.85rem; line-height: 1.5; background: var(--card); border: 1px solid var(--border); color: var(--ink); border-bottom-left-radius: 4px; }
  .ch-msg-row.mine .ch-msg-bubble { background: var(--ink); color: #fff; border-color: var(--ink); border-bottom-left-radius: 16px; border-bottom-right-radius: 4px; }
  .ch-msg-time { font-size: 0.62rem; color: var(--muted); margin-top: 4px; }
  .ch-msg-system { text-align: center; font-size: 0.72rem; color: var(--muted); background: var(--paper); border: 1px solid var(--border); border-radius: 100px; padding: 6px 16px; align-self: center; }
  .ch-input-area { padding: 16px 24px; background: var(--card); border-top: 1px solid var(--border); flex-shrink: 0; }
  .ch-input-row { display: flex; gap: 10px; align-items: flex-end; }
  .ch-input-box { flex: 1; padding: 12px 16px; border: 1px solid var(--border); border-radius: 24px; font-size: 0.88rem; font-family: var(--sans); background: var(--paper); color: var(--ink); outline: none; resize: none; max-height: 120px; transition: border-color 0.2s; line-height: 1.5; }
  .ch-input-box:focus { border-color: var(--accent); background: var(--card); }
  .ch-input-box::placeholder { color: #b0aea7; }
  .ch-send-btn { width: 42px; height: 42px; border-radius: 50%; background: var(--ink); color: #fff; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background 0.2s; font-size: 1rem; }
  .ch-send-btn:hover { background: var(--accent); }
  .ch-send-btn:disabled { background: var(--border); cursor: not-allowed; }
  .ch-input-actions { display: flex; gap: 6px; margin-bottom: 8px; }
  .ch-input-action { padding: 5px 12px; border: 1px solid var(--border); border-radius: 100px; font-size: 0.72rem; color: var(--muted); background: var(--card); font-family: var(--sans); cursor: pointer; transition: all 0.15s; }
  .ch-input-action:hover { border-color: var(--accent); color: var(--accent); }
  .ch-trip-panel { background: var(--card); border-left: 1px solid var(--border); overflow-y: auto; display: flex; flex-direction: column; }
  .ch-trip-panel-header { padding: 20px; border-bottom: 1px solid var(--border); }
  .ch-trip-panel-title { font-family: var(--serif); font-size: 1rem; color: var(--ink); margin-bottom: 4px; }
  .ch-trip-panel-sub { font-size: 0.72rem; color: var(--muted); }
  .ch-trip-detail { padding: 16px 20px; border-bottom: 1px solid var(--border); }
  .ch-trip-detail-item { display: flex; justify-content: space-between; font-size: 0.75rem; margin-bottom: 10px; }
  .ch-trip-detail-label { color: var(--muted); }
  .ch-trip-detail-value { color: var(--ink); font-weight: 500; }
  .ch-trip-actions { padding: 16px 20px; display: flex; flex-direction: column; gap: 8px; }
  .ch-trip-action-btn { width: 100%; padding: 10px; border-radius: 8px; font-size: 0.82rem; font-family: var(--sans); cursor: pointer; transition: all 0.15s; text-align: center; }
  .ch-trip-action-primary { background: var(--ink); color: #fff; border: none; }
  .ch-trip-action-primary:hover { background: var(--accent); }
  .ch-trip-action-secondary { background: transparent; color: var(--ink); border: 1px solid var(--border); }
  .ch-trip-action-secondary:hover { border-color: var(--ink); }
  .ch-empty { text-align: center; padding: 40px 20px; color: var(--muted); font-size: 0.85rem; }
  @keyframes typingBounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }
  .ch-typing-dots { display: flex; gap: 3px; }
  .ch-typing-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--muted); animation: typingBounce 1.2s infinite; }
  .ch-typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .ch-typing-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .ch-spinner { width: 20px; height: 20px; border-radius: 50%; border: 2px solid var(--border); border-top-color: var(--accent); animation: spin 0.7s linear infinite; margin: 20px auto; }
  .fare-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 999; }
  .fare-modal { background: #fff; border-radius: 16px; padding: 28px; width: 320px; box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
  .fare-modal-title { font-family: Georgia; font-size: 1.2rem; margin-bottom: 20px; color: #0d0d0d; }
  .fare-modal-row { display: flex; justify-content: space-between; font-size: 0.82rem; color: #6b6b63; margin-bottom: 10px; }
  .fare-modal-row strong { color: #0d0d0d; }
  .fare-modal-total { display: flex; justify-content: space-between; padding: 14px 0; border-top: 1px solid #e0ddd5; margin-top: 10px; }
  .fare-modal-total span { font-weight: 500; color: #0d0d0d; }
  .fare-modal-total strong { font-family: Georgia; font-size: 1.4rem; color: #1a6b4a; }
  .fare-modal-savings { display: flex; justify-content: space-between; font-size: 0.78rem; color: #6b6b63; margin-bottom: 20px; }
  .fare-modal-savings strong { color: #1a6b4a; }
  .fare-modal-select { width: 100%; padding: 10px 14px; border: 1px solid #e0ddd5; border-radius: 8px; font-size: 0.88rem; font-family: sans-serif; margin-bottom: 16px; outline: none; }
  .fare-modal-btn { width: 100%; padding: 12px; background: #0d0d0d; color: #fff; border: none; border-radius: 8px; cursor: pointer; font-size: 0.88rem; }
`

const COLORS = ['#1a6b4a','#e8673a','#4a6ee8','#b84aaa','#e8b84a','#4ab8e8']

function getInitials(name) {
  if (!name) return '?'
  return name.split('@')[0].slice(0,2).toUpperCase()
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return mins + 'm ago'
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return hrs + 'h ago'
  return Math.floor(hrs / 24) + 'd ago'
}

function FareModal({ onClose, token, convName }) {
  const [passengers, setPassengers] = useState(2)
  const [distance, setDistance] = useState(500)
  const [fareData, setFareData] = useState(null)
  const [loading, setLoading] = useState(false)

  async function calculate() {
    setLoading(true)
    try {
      const res = await fetch('http://localhost:4000/api/fare/calculate', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'rideshare', distanceMiles: parseInt(distance), passengers: parseInt(passengers) })
      })
      const data = await res.json()
      if (res.ok) setFareData(data)
    } catch (err) {
      console.error('Fare error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fare-modal-overlay" onClick={onClose}>
      <div className="fare-modal" onClick={function(e) { e.stopPropagation() }}>
        <div className="fare-modal-title">Fare split calculator</div>

        <div className="fare-modal-row">
          <span>Trip</span><strong>{convName}</strong>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 500, display: 'block', marginBottom: 6 }}>Number of travelers</label>
          <select className="fare-modal-select" value={passengers} onChange={function(e) { setPassengers(e.target.value); setFareData(null) }}>
            <option value="1">1 person (solo)</option>
            <option value="2">2 people</option>
            <option value="3">3 people</option>
            <option value="4">4 people</option>
            <option value="5">5 people</option>
            <option value="6">6 people</option>
          </select>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 500, display: 'block', marginBottom: 6 }}>Distance (miles)</label>
          <select className="fare-modal-select" value={distance} onChange={function(e) { setDistance(e.target.value); setFareData(null) }}>
            <option value="100">~100 miles</option>
            <option value="200">~200 miles</option>
            <option value="300">~300 miles</option>
            <option value="500">~500 miles</option>
            <option value="800">~800 miles</option>
            <option value="1000">~1,000 miles</option>
            <option value="1280">~1,280 miles (NYC to Miami)</option>
          </select>
        </div>

        {!fareData ? (
          <button className="fare-modal-btn" onClick={calculate} disabled={loading}>
            {loading ? 'Calculating...' : 'Calculate fare'}
          </button>
        ) : (
          <>
            <div className="fare-modal-row"><span>Distance</span><strong>{distance} miles</strong></div>
            <div className="fare-modal-row"><span>Travelers</span><strong>{passengers} people</strong></div>
            <div className="fare-modal-row"><span>Group discount</span><strong style={{ color: '#1a6b4a' }}>{fareData.discount}</strong></div>
            <div className="fare-modal-total">
              <span>Per person</span>
              <strong>${fareData.perPerson}</strong>
            </div>
            <div className="fare-modal-savings">
              <span>You save vs solo</span>
              <strong>${fareData.savings}</strong>
            </div>
            <button className="fare-modal-btn" style={{ background: '#6b6b63' }} onClick={function() { setFareData(null) }}>
              Recalculate
            </button>
          </>
        )}

        <button className="fare-modal-btn" style={{ marginTop: 8, background: 'transparent', color: '#6b6b63', border: '1px solid #e0ddd5' }} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}

export default function Chat() {
  const { id } = useParams()
  const [conversations, setConversations] = useState([])
  const [activeConvId, setActiveConvId] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loadingConvs, setLoadingConvs] = useState(true)
  const [typing, setTyping] = useState(false)
  const [showFare, setShowFare] = useState(false)
  const [newConvName, setNewConvName] = useState('')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const pollRef = useRef(null)

  const token = localStorage.getItem('dt_token')
  const user = JSON.parse(localStorage.getItem('dt_user') || '{}')
  const userInitials = user.firstName ? (user.firstName[0] + (user.lastName ? user.lastName[0] : '')).toUpperCase() : 'U'

  useEffect(function() {
    var el = document.createElement('style')
    el.innerHTML = styles
    document.head.appendChild(el)
    fetchConversations()
    return function() {
      document.head.removeChild(el)
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [])

  useEffect(function() {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, typing])

  useEffect(function() {
    if (activeConvId) {
      fetchMessages(activeConvId)
      if (pollRef.current) clearInterval(pollRef.current)
      pollRef.current = setInterval(function() {
        fetchMessages(activeConvId)
      }, 3000)
    }
    return function() {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [activeConvId])

  async function fetchConversations() {
    try {
      const res = await fetch('http://localhost:4000/api/chat', {
        headers: { 'Authorization': 'Bearer ' + token }
      })
      const data = await res.json()
      if (res.ok) {
        setConversations(data.conversations || [])
        if (data.conversations && data.conversations.length > 0) {
          setActiveConvId(data.conversations[0].id)
        }
      }
    } catch (err) {
      console.error('Fetch conversations error:', err)
    } finally {
      setLoadingConvs(false)
    }
  }

  async function fetchMessages(convId) {
    try {
      const res = await fetch('http://localhost:4000/api/chat/' + convId + '/messages', {
        headers: { 'Authorization': 'Bearer ' + token }
      })
      const data = await res.json()
      if (res.ok) setMessages(data.messages || [])
    } catch (err) {
      console.error('Fetch messages error:', err)
    }
  }

  async function sendMessage() {
    if (!input.trim() || !activeConvId) return
    const text = input.trim()
    setInput('')
    try {
      const res = await fetch('http://localhost:4000/api/chat/' + activeConvId + '/messages', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })
      const data = await res.json()
      if (res.ok) {
        setMessages(function(m) { return m.concat(data.message) })
        setTyping(true)
        setTimeout(function() { setTyping(false) }, 2000)
      }
    } catch (err) {
      console.error('Send message error:', err)
    }
  }

  async function createConversation() {
    if (!newConvName.trim()) return
    try {
      const res = await fetch('http://localhost:4000/api/chat', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newConvName.trim(), type: 'group' })
      })
      const data = await res.json()
      if (res.ok) {
        setNewConvName('')
        fetchConversations()
        setActiveConvId(data.conversation.id)
      }
    } catch (err) {
      console.error('Create conversation error:', err)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  var activeConv = conversations.find(function(c) { return c.id === activeConvId })

  return (
    <div className="ch-body">
      {showFare && (
        <FareModal
          onClose={function() { setShowFare(false) }}
          token={token}
          convName={activeConv ? activeConv.name : 'Trip'}
        />
      )}

      <nav className="ch-nav">
        <Link to="/" className="ch-nav-logo">Destination<span>Together</span></Link>
        <div className="ch-nav-right">
          <Link to="/trips" className="ch-nav-link">Find trips</Link>
          <Link to="/profile" className="ch-nav-link">Profile</Link>
          <div className="ch-nav-avatar">{userInitials}</div>
        </div>
      </nav>

      <div className="ch-layout">

        <div className="ch-sidebar">
          <div className="ch-sidebar-header">
            <div className="ch-sidebar-title">Messages</div>
            <input className="ch-search" placeholder="Search conversations..." />
          </div>

          <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 8 }}>
            <input
              style={{ flex: 1, padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: '0.78rem', fontFamily: 'var(--sans)', outline: 'none', background: 'var(--paper)', color: 'var(--ink)' }}
              placeholder="New conversation name..."
              value={newConvName}
              onChange={function(e) { setNewConvName(e.target.value) }}
              onKeyDown={function(e) { if (e.key === 'Enter') createConversation() }}
              onClick={function(e) { e.stopPropagation() }}
              autoComplete="off"
            />
            <button
              onClick={function(e) { e.stopPropagation(); createConversation() }}
              style={{ padding: '8px 12px', background: 'var(--ink)', color: '#fff', border: 'none', borderRadius: 8, fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'var(--sans)', flexShrink: 0 }}
            >
              +
            </button>
          </div>

          <div className="ch-conv-list">
            {loadingConvs && <div className="ch-spinner" />}
            {!loadingConvs && conversations.length === 0 && (
              <div className="ch-empty">No conversations yet.<br />Create one above!</div>
            )}
            {conversations.map(function(c) {
              return (
                <div
                  key={c.id}
                  className={'ch-conv-item' + (activeConvId === c.id ? ' active' : '')}
                  onClick={function() { setActiveConvId(c.id) }}
                >
                  <div className="ch-conv-top">
                    <div className="ch-conv-name">{c.name}</div>
                    <div className="ch-conv-time">{c.last_message_at ? timeAgo(c.last_message_at) : timeAgo(c.created_at)}</div>
                  </div>
                  <div className="ch-conv-preview">{c.last_message || 'No messages yet'}</div>
                  <div className="ch-conv-meta">
                    <span className={'ch-conv-badge ' + (c.type === 'group' ? 'ch-badge-trip' : 'ch-badge-dm')}>
                      {c.type === 'group' ? 'Group' : 'Direct'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="ch-main">
          {!activeConv ? (
            <div className="ch-empty" style={{ margin: 'auto' }}>
              Select a conversation or create a new one
            </div>
          ) : (
            <>
              <div className="ch-chat-header">
                <div className="ch-chat-header-left">
                  <div className="ch-chat-avatar">{getInitials(activeConv.name)}</div>
                  <div>
                    <div className="ch-chat-title">{activeConv.name}</div>
                    <div className="ch-chat-subtitle">{activeConv.type === 'group' ? 'Group conversation' : 'Direct message'}</div>
                  </div>
                </div>
                <div className="ch-chat-actions">
                  <button className="ch-chat-action-btn">Members</button>
                </div>
              </div>

              <div className="ch-messages">
                <div className="ch-date-divider">Today</div>
                <div className="ch-msg-system">Conversation started</div>
                {messages.map(function(msg) {
                  var isMine = msg.sender_id === user.id
                  return (
                    <div key={msg.id} className={'ch-msg-row' + (isMine ? ' mine' : '')}>
                      {!isMine && (
                        <div className="ch-msg-avatar" style={{ background: COLORS[msg.sender_id ? msg.sender_id.charCodeAt(0) % COLORS.length : 0] }}>
                          {getInitials(msg.sender_name)}
                        </div>
                      )}
                      <div className="ch-msg-content">
                        {!isMine && <div className="ch-msg-sender">{msg.sender_name}</div>}
                        <div className="ch-msg-bubble">{msg.text}</div>
                        <div className="ch-msg-time">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                    </div>
                  )
                })}
                {typing && (
                  <div className="ch-msg-row">
                    <div className="ch-msg-avatar">...</div>
                    <div className="ch-msg-content">
                      <div className="ch-msg-bubble" style={{ padding: '12px 16px' }}>
                        <div className="ch-typing-dots">
                          <div className="ch-typing-dot" />
                          <div className="ch-typing-dot" />
                          <div className="ch-typing-dot" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="ch-input-area">
                <div className="ch-input-actions">
                  <button className="ch-input-action" onClick={function() { setInput('Anyone up for a food stop?') }}>Food stop?</button>
                  <button className="ch-input-action" onClick={function() { setInput('What time should we leave?') }}>Departure time?</button>
                  <button className="ch-input-action" onClick={function() { setInput('I can help with driving!') }}>Offer to drive</button>
                </div>
                <div className="ch-input-row">
                  <textarea
                    ref={inputRef}
                    className="ch-input-box"
                    placeholder="Type a message..."
                    value={input}
                    onChange={function(e) { setInput(e.target.value) }}
                    onKeyDown={handleKeyDown}
                    rows={1}
                  />
                  <button className="ch-send-btn" onClick={sendMessage} disabled={!input.trim()}>
                    ➤
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="ch-trip-panel">
          <div className="ch-trip-panel-header">
            <div className="ch-trip-panel-title">Trip details</div>
            <div className="ch-trip-panel-sub">{activeConv ? activeConv.name : 'No trip selected'}</div>
          </div>
          <div className="ch-trip-detail">
            <div className="ch-trip-detail-item">
              <span className="ch-trip-detail-label">Conversation</span>
              <span className="ch-trip-detail-value">{activeConv ? activeConv.type : '-'}</span>
            </div>
            <div className="ch-trip-detail-item">
              <span className="ch-trip-detail-label">Created</span>
              <span className="ch-trip-detail-value">{activeConv ? new Date(activeConv.created_at).toLocaleDateString() : '-'}</span>
            </div>
          </div>
          <div className="ch-trip-actions">
            <button
              className="ch-trip-action-btn ch-trip-action-primary"
              onClick={function() { alert('Booking confirmed! You will receive a confirmation shortly.') }}
            >
              Confirm booking
            </button>
            <button
              className="ch-trip-action-btn ch-trip-action-secondary"
              onClick={function() { setShowFare(true) }}
            >
              View fare split
            </button>
            <button
              className="ch-trip-action-btn ch-trip-action-secondary"
              style={{ color: '#d94040', borderColor: '#fecaca' }}
              onClick={function() {
                if (window.confirm('Are you sure you want to leave this group?')) {
                  window.location.href = '/trips'
                }
              }}
            >
              Leave group
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}