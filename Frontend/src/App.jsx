import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CategoryProvider } from "./contexts/CategoryContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Mission from "./pages/AboutHealthTrust/Mission";
import ScrollToTop from "./ScrollToTop";

import MedicineDetail from "./pages/PharmaInformation/MedicineDetail";
import MedicineList from './pages/PharmaInformation/MedicineList';


import Home from "./pages/Home";
import Partner from "./pages/AboutHealthTrust/Partner";
import CategoryHome from "./pages/Category/CategoryHome";
import DiseaseList from "./pages/Category/DiseaseList";
import DiseaseDetail from "./pages/Category/DiseaseDetail";
import Achievement from "./pages/AboutHealthTrust/Achievement";
import ScheduleBlood from "./pages/Community/ScheduleBlood";


import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import EmailVerification from './pages/auth/EmailVerification'
import News from "./pages/Community/News";
import BMI from "./pages/HealthCheck/BMI";
import TDEECalculator from "./pages/HealthCheck/TDEECalculator";
import IdealWeightCalculator from "./pages/HealthCheck/IdealWeightCalculator";
import BodyFatCalculator from "./pages/HealthCheck/BodyFatCalculator";

import Dashboard from './pages/PersonalTracker/Dashboard'
import EditProfile from './pages/PersonalTracker/EditProfile'

import "./App.css";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <CategoryProvider>
            <ScrollToTop />
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
              <Route path="/PharmaInformation/MedicineList" element={<MedicineList />} />
              <Route path="/AboutHealthTrust/Achievement" element={<Achievement />} />
              <Route path="/AboutHealthTrust/Partner" element={<Partner />} />
              <Route path="/PharmaInformation/MedicineDetail/:id" element={<MedicineDetail />} />
              <Route path="/Community/ScheduleBlood" element={<ScheduleBlood />} />
              <Route path="/HealthCheck/BMI" element={<BMI />} />
              <Route path="/HealthCheck/TDEECalculator" element={<TDEECalculator />} />
              <Route path="/HealthCheck/IdealWeightCalculator" element={<IdealWeightCalculator />} />
              <Route path="/HealthCheck/BodyFatCalculator" element={<BodyFatCalculator />} />
              <Route path="/Community/News" element={<News />} />

              <Route path="/about-healthtrust/mission" element={<Mission />} />
              <Route path="/Category/CategoryHome" element={<CategoryHome />} />
              <Route path="/Category/DiseaseList/:categoryId" element={<DiseaseList />} />
              <Route path="/Category/DiseaseDetail/:diseaseId" element={<DiseaseDetail />} />

              {/* Thêm các route khác tại đây */}



            </Routes>
          </CategoryProvider>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
