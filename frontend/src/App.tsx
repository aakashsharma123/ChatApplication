import React, { useEffect } from 'react'
import './index.css'; // or './styles/tailwind.css'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import { useAuthStore } from './store/useAuthStore'
import { Loader } from 'lucide-react'
import { Navigate } from 'react-router-dom'
import SignUpPage from './pages/SignupPage'
import { Toaster } from 'react-hot-toast'

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers ,  } = useAuthStore();
  console.log("onlineUsers" , onlineUsers)
  useEffect(() => {
    checkAuth();    
  }, [checkAuth  , onlineUsers])

  console.log("authuser", authUser)
// isCheckingAuth && !authUser
  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    )
  }
  return (
    <>
      <div >
        <Navbar />

        <Routes>
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to="/login" replace />}
          />
          <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to={'/login'} />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={'/'} />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" replace />} />

        </Routes>
        <Toaster />
      </div>
    </>
  )
}

export default App
