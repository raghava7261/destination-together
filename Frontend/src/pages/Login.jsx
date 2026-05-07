import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --ink: #0d0d0d; --paper: #f7f5f0; --accent: #1a6b4a;
    --accent2: #e8673a; --muted: #6b6b63; --border: #e0ddd5;
    --card: #ffffff; --error: #d94040;
    --serif: 'DM Serif Display', Georgia, serif;
    --sans: 'DM Sans', sans-serif;
  }
  .auth-body { background: var(--paper); font-family: var(--sans); min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; }
  .auth-left { background: var(--ink); padding: 48px; display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden; }
  .auth-left-circle { position: absolute; border-radius: 50%; opacity: 0.06; }
  .auth-left-circle-1 { width: 500px; height: 500px; background: var(--accent); top: -150px; right: -150px; }
  .auth-left-circle-2 { width: 300px; height: 300px; background: var(--accent2); bottom: -80px; left: -80px; }
  .auth-logo { font-family: var(--serif); font-size: 1.3rem; color: #fff; text-decoration: none; position: relative; z-index: 1; }
  .auth-logo span { color: #6ec99a; }
  .auth-left-content { position: relative; z-index: 1; }
  .auth-left-label { font-size: 0.72rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: #6ec99a; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
  .auth-left-label::before { content: ''; width: 20px; height: 1px; background: #6ec99a; }
  .auth-left-heading { font-family: var(--serif); font-size: clamp(2rem, 3vw, 2.8rem); color: #fff; line-height: 1.15; letter-spacing: -0.02em; margin-bottom: 24px; }
  .auth-left-heading em { font-style: italic; color: #6ec99a; }
  .auth-left-desc { font-size: 0.9rem; color: rgba(255,255,255,0.5); line-height: 1.7; max-width: 360px; }
  .auth-trip-card { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 20px; margin-top: 40px; position: relative; z-index: 1; }
  .auth-trip-tag { font-size: 0.68rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: #6ec99a; margin-bottom: 12px; }
  .auth-trip-route { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
  .auth-trip-dot { width: 8px; height: 8px; border-radius: 50%; background: #6ec99a; flex-shrink: 0; }
  .auth-trip-dot-end { width: 8px; height: 8px; border-radius: 50%; background: var(--accent2); flex-shrink: 0; }
  .auth-trip-line { flex: 1; height: 1px; background: rgba(255,255,255,0.15); }
  .auth-trip-labels { display: flex; justify-content: space-between; font-size: 0.78rem; color: rgba(255,255,255,0.5); margin-bottom: 16px; }
  .auth-trip-labels strong { color: #fff; font-weight: 500; }
  .auth-trip-avatars { display: flex; align-items: center; }
  .auth-trip-avatar { width: 28px; height: 28px; border-radius: 50%; border: 2px solid var(--ink); display: flex; align-items: center; justify-content: center; font-size: 0.6rem; font-weight: 500; color: #fff; margin-left: -6px; }
  .auth-trip-avatar:first-child { margin-left: 0; }
  .auth-trip-info { font-size: 0.75rem; color: rgba(255,255,255,0.5); margin-left: 8px; }
  .auth-trip-info strong { color: #fff; }
  .auth-left-stats { display: flex; gap: 32px; position: relative; z-index: 1; }
  .auth-left-stat-num { font-family: var(--serif); font-size: 1.6rem; color: #fff; line-height: 1; margin-bottom: 4px; }
  .auth-left-stat-num span { color: #6ec99a; }
  .auth-left-stat-label { font-size: 0.72rem; color: rgba(255,255,255,0.4); }
  .auth-right { display: flex; align-items: center; justify-content: center; padding: 48px; }
  .auth-form-wrap { width: 100%; max-width: 400px; }
  .auth-form-header { margin-bottom: 36px; }
  .auth-form-title { font-family: var(--serif); font-size: 2rem; color: var(--ink); letter-spacing: -0.02em; margin-bottom: 8px; }
  .auth-form-subtitle { font-size: 0.88rem; color: var(--muted); }
  .auth-form-subtitle a { color: var(--accent); text-decoration: none; font-weight: 500; }
  .auth-field { margin-bottom: 20px; }
  .auth-label { display: block; font-size: 0.78rem; font-weight: 500; color: var(--ink); margin-bottom: 8px; }
  .auth-input-wrap { position: relative; }
  .auth-input { width: 100%; padding: 13px 16px; border: 1px solid var(--border); border-radius: 10px; font-size: 0.9rem; font-family: var(--sans); background: var(--card); color: var(--ink); outline: none; transition: border-color 0.2s, box-shadow 0.2s; appearance: none; }
  .auth-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(26,107,74,0.08); }
  .auth-input.error { border-color: var(--error); }
  .auth-input::placeholder { color: #b0aea7; }
  .auth-input-icon { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); color: var(--muted); cursor: pointer; font-size: 1rem; user-select: none; transition: color 0.2s; }
  .auth-input-with-icon { padding-right: 44px; }
  .auth-error-msg { font-size: 0.72rem; color: var(--error); margin-top: 6px; }
  .auth-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .auth-forgot-row { display: flex; justify-content: flex-end; margin-top: -12px; margin-bottom: 20px; }
  .auth-forgot { font-size: 0.78rem; color: var(--accent); text-decoration: none; }
  .auth-submit { width: 100%; padding: 14px; background: var(--ink); color: #fff; border: none; border-radius: 10px; font-size: 0.95rem; font-weight: 500; font-family: var(--sans); cursor: pointer; transition: background 0.2s, transform 0.15s; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; gap: 8px; }
  .auth-submit:hover { background: var(--accent); transform: translateY(-1px); }
  .auth-submit:disabled { background: var(--muted); cursor: not-allowed; transform: none; }
  .auth-divider { display: flex; align-items: center; gap: 12px; font-size: 0.78rem; color: var(--muted); margin-bottom: 20px; }
  .auth-divider::before, .auth-divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .auth-social-btn { width: 100%; padding: 12px; background: var(--card); border: 1px solid var(--border); border-radius: 10px; font-size: 0.88rem; font-family: var(--sans); color: var(--ink); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: background 0.2s; margin-bottom: 12px; text-decoration: none; }
  .auth-social-btn:hover { background: var(--paper); }
  .auth-tabs { display: flex; background: var(--paper); border: 1px solid var(--border); border-radius: 10px; padding: 4px; margin-bottom: 32px; }
  .auth-tab { flex: 1; padding: 10px; border: none; background: transparent; font-size: 0.875rem; font-family: var(--sans); color: var(--muted); cursor: pointer; border-radius: 7px; transition: background 0.2s, color 0.2s; }
  .auth-tab.active { background: var(--card); color: var(--ink); font-weight: 500; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
  .auth-terms { font-size: 0.72rem; color: var(--muted); text-align: center; line-height: 1.6; }
  .auth-terms a { color: var(--accent); text-decoration: none; }
  .auth-strength { margin-top: 8px; }
  .auth-strength-bars { display: flex; gap: 4px; margin-bottom: 4px; }
  .auth-strength-bar { flex: 1; height: 3px; border-radius: 100px; background: var(--border); transition: background 0.3s; }
  .auth-strength-bar.weak { background: var(--error); }
  .auth-strength-bar.fair { background: var(--accent2); }
  .auth-strength-bar.good { background: #4a6ee8; }
  .auth-strength-bar.strong { background: var(--accent); }
  .auth-strength-label { font-size: 0.68rem; color: var(--muted); }
  .auth-success { text-align: center; padding: 40px 0; }
  .auth-success-icon { width: 64px; height: 64px; border-radius: 50%; background: #e8f5ef; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin: 0 auto 20px; }
  .auth-success-title { font-family: var(--serif); font-size: 1.6rem; color: var(--ink); margin-bottom: 10px; }
  .auth-success-desc { font-size: 0.88rem; color: var(--muted); line-height: 1.6; }
  .auth-global-error { background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 10px 14px; font-size: 0.82rem; color: var(--error); margin-bottom: 16px; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .auth-spinner { width: 16px; height: 16px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; animation: spin 0.7s linear infinite; display: inline-block; }
  @media (max-width: 768px) { .auth-body { grid-template-columns: 1fr; } .auth-left { display: none; } .auth-right { padding: 32px 24px; } }
`

function getStrength(pw) {
  if (!pw) return { score: 0, label: '' }
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const cls = ['', 'weak', 'fair', 'good', 'strong']
  return { score, label: labels[score], cls: cls[score] }
}

function AuthLeft() {
  return (
    <div className="auth-left">
      <div className="auth-left-circle auth-left-circle-1" />
      <div className="auth-left-circle auth-left-circle-2" />
      <Link to="/" className="auth-logo">Destination<span>Together</span></Link>
      <div className="auth-left-content">
        <div className="auth-left-label">Join the community</div>
        <h2 className="auth-left-heading">Your next trip is<br /><em>one match away.</em></h2>
        <p className="auth-left-desc">Thousands of travelers across the US are already splitting fares, sharing rides, and discovering hidden gems together.</p>
        <div className="auth-trip-card">
          <div className="auth-trip-tag">Trending trip · Right now</div>
          <div className="auth-trip-route">
            <div className="auth-trip-dot" />
            <div className="auth-trip-line" />
            <div className="auth-trip-dot-end" />
          </div>
          <div className="auth-trip-labels">
            <div><strong>New York, NY</strong><br />Dec 24 · 08:00 AM</div>
            <div style={{ textAlign: 'right' }}><strong>Miami, FL</strong><br />~19 hrs</div>
          </div>
          <div className="auth-trip-avatars">
            <div className="auth-trip-avatar" style={{ background: '#1a6b4a' }}>JC</div>
            <div className="auth-trip-avatar" style={{ background: '#e8673a' }}>SM</div>
            <div className="auth-trip-avatar" style={{ background: '#4a6ee8' }}>DN</div>
            <div className="auth-trip-avatar" style={{ background: '#b84aaa' }}>+3</div>
            <span className="auth-trip-info"><strong>2 spots</strong> left · $85/person</span>
          </div>
        </div>
      </div>
      <div className="auth-left-stats">
        <div><div className="auth-left-stat-num">48<span>K+</span></div><div className="auth-left-stat-label">Trips completed</div></div>
        <div><div className="auth-left-stat-num">38<span>%</span></div><div className="auth-left-stat-label">Avg. savings</div></div>
        <div><div className="auth-left-stat-num">4.8<span>★</span></div><div className="auth-left-stat-label">Avg. rating</div></div>
      </div>
    </div>
  )
}

function LoginForm({ onSwitch }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [errors, setErrors] = useState({})
  const [globalError, setGlobalError] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    setGlobalError('')
    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setGlobalError(data.error || 'Login failed')
        return
      }
      localStorage.setItem('dt_token', data.token)
      localStorage.setItem('dt_user', JSON.stringify(data.user))
      navigate('/trips')
    } catch (err) {
      setGlobalError('Connection error. Is the server running?')
    } finally {
      setLoading(false)
    }
  }

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: '' }))
    setGlobalError('')
  }

  return (
    <div className="auth-form-wrap">
      <div className="auth-form-header">
        <div className="auth-form-title">Welcome back</div>
        <div className="auth-form-subtitle">
          Don't have an account?{' '}
          <a href="#" onClick={e => { e.preventDefault(); onSwitch() }}>Sign up free</a>
        </div>
      </div>

      {globalError && <div className="auth-global-error">{globalError}</div>}

      <a href="#" className="auth-social-btn">
        <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z"/></svg>
        Continue with Google
      </a>

      <div className="auth-divider">or sign in with email</div>

      <div className="auth-field">
        <label className="auth-label">Email address</label>
        <input
          className={'auth-input' + (errors.email ? ' error' : '')}
          type="email" placeholder="you@example.com"
          value={form.email} onChange={e => set('email', e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        />
        {errors.email && <div className="auth-error-msg">{errors.email}</div>}
      </div>

      <div className="auth-field">
        <label className="auth-label">Password</label>
        <div className="auth-input-wrap">
          <input
            className={'auth-input auth-input-with-icon' + (errors.password ? ' error' : '')}
            type={showPw ? 'text' : 'password'} placeholder="Enter your password"
            value={form.password} onChange={e => set('password', e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
          <span className="auth-input-icon" onClick={() => setShowPw(p => !p)}>
            {showPw ? '🙈' : '👁'}
          </span>
        </div>
        {errors.password && <div className="auth-error-msg">{errors.password}</div>}
      </div>

      <div className="auth-forgot-row">
        <a href="#" className="auth-forgot">Forgot password?</a>
      </div>

      <button className="auth-submit" onClick={handleSubmit} disabled={loading}>
        {loading ? <span className="auth-spinner" /> : 'Sign in'}
      </button>

      <div className="auth-terms">
        By continuing, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}

function RegisterForm({ onSwitch }) {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '', city: '', travelStyle: '' })
  const [showPw, setShowPw] = useState(false)
  const [errors, setErrors] = useState({})
  const [globalError, setGlobalError] = useState('')
  const [loading, setLoading] = useState(false)
  const strength = getStrength(form.password)

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: '' }))
    setGlobalError('')
  }

  const validateStep1 = () => {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 8) e.password = 'Minimum 8 characters'
    return e
  }

  const validateStep2 = () => {
    const e = {}
    if (!form.firstName) e.firstName = 'Required'
    if (!form.lastName) e.lastName = 'Required'
    if (!form.phone) e.phone = 'Phone is required'
    if (!form.city) e.city = 'City is required'
    return e
  }

  const handleNext = async () => {
    if (step === 1) {
      const e = validateStep1()
      if (Object.keys(e).length) { setErrors(e); return }
      setStep(2)
    } else if (step === 2) {
      const e = validateStep2()
      if (Object.keys(e).length) { setErrors(e); return }
      setLoading(true)
      setGlobalError('')
      try {
        const res = await fetch('http://localhost:4000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            password: form.password,
            phone: form.phone,
            city: form.city,
            travelStyle: form.travelStyle,
          }),
        })
        const data = await res.json()
        if (!res.ok) {
          setGlobalError(data.error || 'Registration failed')
          setStep(1)
          return
        }
        localStorage.setItem('dt_token', data.token)
        localStorage.setItem('dt_user', JSON.stringify(data.user))
        setStep(3)
      } catch (err) {
        setGlobalError('Connection error. Is the server running?')
      } finally {
        setLoading(false)
      }
    }
  }

  const StepDots = () => (
    <div style={{ display: 'flex', gap: '6px', marginBottom: '32px' }}>
      {[1, 2].map(n => (
        <div key={n} style={{ height: '4px', flex: 1, borderRadius: '100px', background: n <= step ? 'var(--ink)' : 'var(--border)', transition: 'background 0.3s' }} />
      ))}
    </div>
  )

  if (step === 3) {
    return (
      <div className="auth-form-wrap">
        <div className="auth-success">
          <div className="auth-success-icon">🎉</div>
          <div className="auth-success-title">You are all set!</div>
          <div className="auth-success-desc">Welcome to Destination Together, {form.firstName}!<br />Your account has been created.</div>
          <button className="auth-submit" style={{ marginTop: '28px' }} onClick={() => navigate('/trips')}>
            Find my first trip
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-form-wrap">
      <div className="auth-form-header">
        <div className="auth-form-title">{step === 1 ? 'Create account' : 'Almost there'}</div>
        <div className="auth-form-subtitle">
          {step === 1
            ? <span>Already have an account? <a href="#" onClick={e => { e.preventDefault(); onSwitch() }}>Sign in</a></span>
            : <span style={{ color: 'var(--muted)' }}>Step {step} of 2</span>
          }
        </div>
      </div>

      <StepDots />

      {globalError && <div className="auth-global-error">{globalError}</div>}

      {step === 1 && (
        <>
          <a href="#" className="auth-social-btn">
            <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z"/></svg>
            Sign up with Google
          </a>
          <div className="auth-divider">or create with email</div>
          <div className="auth-field">
            <label className="auth-label">Email address</label>
            <input className={'auth-input' + (errors.email ? ' error' : '')} type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
            {errors.email && <div className="auth-error-msg">{errors.email}</div>}
          </div>
          <div className="auth-field">
            <label className="auth-label">Password</label>
            <div className="auth-input-wrap">
              <input className={'auth-input auth-input-with-icon' + (errors.password ? ' error' : '')} type={showPw ? 'text' : 'password'} placeholder="Min. 8 characters" value={form.password} onChange={e => set('password', e.target.value)} />
              <span className="auth-input-icon" onClick={() => setShowPw(p => !p)}>{showPw ? '🙈' : '👁'}</span>
            </div>
            {form.password && (
              <div className="auth-strength">
                <div className="auth-strength-bars">
                  {[1,2,3,4].map(n => <div key={n} className={'auth-strength-bar' + (n <= strength.score ? ' ' + strength.cls : '')} />)}
                </div>
                <div className="auth-strength-label">{strength.label && 'Password strength: ' + strength.label}</div>
              </div>
            )}
            {errors.password && <div className="auth-error-msg">{errors.password}</div>}
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div className="auth-row">
            <div className="auth-field">
              <label className="auth-label">First name</label>
              <input className={'auth-input' + (errors.firstName ? ' error' : '')} placeholder="James" value={form.firstName} onChange={e => set('firstName', e.target.value)} />
              {errors.firstName && <div className="auth-error-msg">{errors.firstName}</div>}
            </div>
            <div className="auth-field">
              <label className="auth-label">Last name</label>
              <input className={'auth-input' + (errors.lastName ? ' error' : '')} placeholder="Carter" value={form.lastName} onChange={e => set('lastName', e.target.value)} />
              {errors.lastName && <div className="auth-error-msg">{errors.lastName}</div>}
            </div>
          </div>
          <div className="auth-field">
            <label className="auth-label">Phone number</label>
            <input className={'auth-input' + (errors.phone ? ' error' : '')} type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={e => set('phone', e.target.value)} />
            {errors.phone && <div className="auth-error-msg">{errors.phone}</div>}
          </div>
          <div className="auth-field">
            <label className="auth-label">Your city</label>
            <input className={'auth-input' + (errors.city ? ' error' : '')} placeholder="e.g. New York, Chicago" value={form.city} onChange={e => set('city', e.target.value)} />
            {errors.city && <div className="auth-error-msg">{errors.city}</div>}
          </div>
          <div className="auth-field">
            <label className="auth-label">Travel style <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(optional)</span></label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Budget', 'Comfort', 'Adventure', 'Leisure'].map(style => (
                <button key={style} onClick={() => set('travelStyle', style)} style={{ padding: '8px 16px', borderRadius: '100px', border: '1px solid ' + (form.travelStyle === style ? 'var(--accent)' : 'var(--border)'), background: form.travelStyle === style ? '#e8f5ef' : 'var(--card)', color: form.travelStyle === style ? 'var(--accent)' : 'var(--muted)', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'var(--sans)', transition: 'all 0.2s' }}>
                  {style}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <div style={{ display: 'flex', gap: '12px' }}>
        {step === 2 && (
          <button className="auth-social-btn" style={{ flex: '0 0 auto', width: 'auto', padding: '12px 20px', marginBottom: 0 }} onClick={() => setStep(1)}>
            Back
          </button>
        )}
        <button className="auth-submit" style={{ marginBottom: 0 }} onClick={handleNext} disabled={loading}>
          {loading ? <span className="auth-spinner" /> : step === 1 ? 'Continue' : 'Create account'}
        </button>
      </div>

      {step === 1 && (
        <div className="auth-terms" style={{ marginTop: '20px' }}>
          By signing up, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.
        </div>
      )}
    </div>
  )
}

export default function Login() {
  const [mode, setMode] = useState('login')

  useEffect(() => {
    const el = document.createElement('style')
    el.innerHTML = styles
    document.head.appendChild(el)
    return () => document.head.removeChild(el)
  }, [])

  return (
    <div className="auth-body">
      <AuthLeft />
      <div className="auth-right">
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div className="auth-tabs">
            <button className={'auth-tab' + (mode === 'login' ? ' active' : '')} onClick={() => setMode('login')}>Sign in</button>
            <button className={'auth-tab' + (mode === 'register' ? ' active' : '')} onClick={() => setMode('register')}>Create account</button>
          </div>
          {mode === 'login' ? <LoginForm onSwitch={() => setMode('register')} /> : <RegisterForm onSwitch={() => setMode('login')} />}
        </div>
      </div>
    </div>
  )
}