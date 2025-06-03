// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import LandingPage from "./pages/LandingPage";
import SavedDesign from "./pages/SavedDesigns";
import Profile from "./pages/Profile";
import AdminHome from './pages/AdminHome';
import EditDesignPage from './pages/EditDesignPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/LandingPage" element={<LandingPage />} />
      <Route path="/gallery" element={<SavedDesign />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/admin" element={<AdminHome />} />
      <Route path="/edit" element={<EditDesignPage />} />

    </Routes>
  );
}
