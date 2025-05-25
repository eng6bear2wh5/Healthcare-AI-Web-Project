import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Mission from "./pages/AboutHealthTrust/Mission";
import SafeMedicine from "./pages/PharmaInformation/SafeMedicine";
import MedicineDetail from "./pages/PharmaInformation/MedicineDetail";
import HeartDisease from "./pages/Category/HeartDisease";

import Home from "./pages/Home";
import Achievement from "./pages/AboutHealthTrust/Achievement";
import Event from "./pages/Community/Event";
import Forum from "./pages/Community/Forum";
import ForumDetail from "./pages/Community/ForumDetail";
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
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} /> {/* ✅ Dùng Home */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/email-verification" element={<EmailVerification />} />

            <Route path="/personal-tracker/dashboard" element={<Dashboard />} />
            <Route path="/personal-tracker/edit-profile" element={<EditProfile />} />
            <Route path="/personal-tracker/" element={<Navigate to="/personal-tracker/dashboard" replace />} />
            <Route path="/AboutHealthTrust/Mission" element={<Mission />} />
            <Route path="/PharmaInformation/SafeMedicine" element={<SafeMedicine />} />
            <Route path="/AboutHealthTrust/Achievement" element={<Achievement />} />
            <Route path="/PharmaInformation/medicine/:name" element={<MedicineDetail />} />
            <Route path="/Community/Event" element={<Event />} />
            <Route path="/Community/Forum" element={<Forum />} />
            <Route path="/Community/Forum/:topicId" element={<ForumDetail />} />
            <Route path="Category/HeartDisease" element={<HeartDisease />} />
            <Route path="/about-healthtrust/mission" element={<Mission />} />

            {/* Thêm các route khác tại đây */}



          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
