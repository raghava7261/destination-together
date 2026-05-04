import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import TripPlanning from './pages/TripPlanning'
import Chat from './pages/Chat'
import Profile from './pages/Profile'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/trips"    element={<TripPlanning />} />
        <Route path="/chat"     element={<Chat />} />
        <Route path="/chat/:id" element={<Chat />} />
        <Route path="/profile"  element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App