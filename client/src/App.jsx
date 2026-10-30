import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import SecurityToolsHubPage from './pages/SecurityToolsHubPage';
import PhishingAnalyzerPage from './pages/PhishingAnalyzerPage';
import ScamAnalyzerPage from './pages/ScamAnalyzerPage';
import ImageAnalyzerPage from './pages/ImageAnalyzerPage';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ToolsPage from './pages/ToolsPage';
import ToolDetailPage from './pages/ToolDetailPage';
import IntelligenceCenterPage from './pages/IntelligenceCenterPage';
import ReportsPage from './pages/ReportsPage';
import HistoryPage from './pages/HistoryPage';
import DocumentationPage from './pages/DocumentationPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import SecurityPage from './pages/SecurityPage';
import PrivacyPage from './pages/PrivacyPage';

export default function App() {
  const [user, setUser] = useState({ fullName: 'Security Analyst', email: 'analyst@xelovo.io', role: 'lead_analyst' });

  const handleLogout = () => {
    localStorage.removeItem('xelovo_token');
    setUser(null);
  };

  return (
    <ThemeProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', transition: 'background-color 0.25s ease, color 0.25s ease' }}>
          <Navbar />

          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              
              {/* Phase 2 Security Tools Routes */}
              <Route path="/security-tools" element={<SecurityToolsHubPage />} />
              <Route path="/security-tools/phishing-analyzer" element={<PhishingAnalyzerPage />} />
              <Route path="/security-tools/scam-analyzer" element={<ScamAnalyzerPage />} />
              <Route path="/security-tools/image-analyzer" element={<ImageAnalyzerPage />} />

              {/* Other Platform Routes */}
              <Route path="/login" element={<LoginPage setUser={setUser} />} />
              <Route path="/register" element={<RegisterPage setUser={setUser} />} />
              <Route path="/dashboard" element={<DashboardPage user={user} onOpenCommand={() => {}} />} />
              <Route path="/tools" element={<ToolsPage />} />
              <Route path="/tools/:id" element={<ToolDetailPage />} />
              <Route path="/investigation" element={<IntelligenceCenterPage />} />
              <Route path="/ai-assistant" element={<Navigate to="/security-tools" replace />} />
              <Route path="/learn" element={<DocumentationPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/documentation" element={<DocumentationPage />} />
              <Route path="/profile" element={<ProfilePage user={user} />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/security" element={<SecurityPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}
