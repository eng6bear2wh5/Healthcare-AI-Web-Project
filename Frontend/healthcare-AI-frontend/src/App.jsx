import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home'

import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import EmailVerification from './pages/auth/EmailVerification'

import Dashboard from './pages/PersonalTracker/Dashboard'
import EditProfile from './pages/PersonalTracker/EditProfile'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/personal-tracker/dashboard" element={<Dashboard />} />
        <Route path="/personal-tracker/edit-profile" element={<EditProfile />} />
        <Route path="/personal-tracker/" element={<Navigate to="/personal-tracker/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;