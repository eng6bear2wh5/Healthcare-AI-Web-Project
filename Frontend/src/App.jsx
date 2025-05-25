import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Mission from "./pages/AboutHealthTrust/Mission";
import SafeMedicine from "./pages/PharmaInformation/SafeMedicine";
import MedicineDetail from "./pages/PharmaInformation/MedicineDetail";
import HeartDisease from "./pages/Category/HeartDisease";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Partner from "./pages/AboutHealthTrust/Partner";
import Achievement from "./pages/AboutHealthTrust/Achievement";
import Event from "./pages/Community/Event";
import Forum from "./pages/Community/Forum";
import ForumDetail from "./pages/Community/ForumDetail";

import "./App.css"; // Đường dẫn đến file CSS của bạn
function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} /> {/* ✅ Dùng Home */}
            <Route path="/login" element={<Login />} />
            <Route path="/AboutHealthTrust/Mission" element={<Mission />} />
            <Route path="/PharmaInformation/SafeMedicine" element={<SafeMedicine />} />
            <Route path="/AboutHealthTrust/Partner" element={<Partner />} />
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
