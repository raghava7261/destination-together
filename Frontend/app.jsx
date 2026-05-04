import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import TripPlanning from './pages/TripPlanning'
import Chat from './pages/Chat'
import Profile from './pages/Profile'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"           element={<Home />} />
        <Route path="/login"      element={<Login />} />
        <Route path="/register"   element={<Register />} />
        <Route path="/trips"      element={<TripPlanning />} />
        <Route path="/chat/:id"   element={<Chat />} />
        <Route path="/profile"    element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App