import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import OnboardingStep2 from './pages/OnboardingStep2';
import OnboardingStep3 from './pages/OnboardingStep3';
import OnboardingStep4 from './pages/OnboardingStep4';
import OnboardingStep5 from './pages/OnboardingStep5';
import OnboardingStep6 from './pages/OnboardingStep6';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Streak from './pages/Streak';
import Journeys from './pages/Journeys';
import Sections from './pages/Sections';
import Lesson from './pages/Lesson';
import Summarizer from './pages/Summarizer';
import SkillSelection from './pages/SkillSelection';
import Nexus from './pages/Nexus';
import Leaderboard from './pages/Leaderboard';
import Settings from './pages/Settings';
import CommunityHub from './pages/CommunityHub';

import AIChat from './components/AIChat';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Onboarding />} />
        <Route path="/register-step2" element={<OnboardingStep2 />} />
        <Route path="/register-step3" element={<OnboardingStep3 />} />
        <Route path="/register-step4" element={<OnboardingStep4 />} />
        <Route path="/register-step5" element={<OnboardingStep5 />} />
        <Route path="/register-step6" element={<OnboardingStep6 />} />
        <Route path="/register-step7" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/streak" element={<Streak />} />
        <Route path="/journeys" element={<Journeys />} />
        <Route path="/sections" element={<Sections />} />
        <Route path="/lesson/:courseId/:sectionId/:lessonId" element={<Lesson />} />
        <Route path="/summarizer" element={<Summarizer />} />
        <Route path="/select-skills" element={<SkillSelection />} />
        <Route path="/nexus" element={<Nexus />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/community" element={<CommunityHub />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <AIChat />
    </Router>
  );
}

export default App;