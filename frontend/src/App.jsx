import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CaseModal from './components/CaseModal';

import LandingPage from './pages/LandingPage';
import MissionComplete from './pages/MissionComplete';
import Dashboard from './pages/Dashboard';
import Cases from './pages/Cases';
import CaseDetails from './pages/CaseDetails';
import Evidence from './pages/Evidence';
import AiAnalysis from './pages/AiAnalysis';
import RelationshipGraph from './pages/RelationshipGraph';
import TimelinePage from './pages/TimelinePage';
import Patterns from './pages/Patterns';
import IntelligenceReport from './pages/IntelligenceReport';
import Settings from './pages/Settings';

/**
 * The dashboard app shell (sidebar + header + routed pages + upload modal)
 * is unchanged from before — same JSX, same components, same behavior.
 * It's just no longer rendered for the "/" route, which now belongs to
 * the landing page instead.
 */
function DashboardShell() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#0D1016] text-gray-100 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header onUploadClick={() => setIsUploadOpen(true)} />

        <main className="flex-1 pb-10">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cases" element={<Cases onOpenUpload={() => setIsUploadOpen(true)} />} />
            <Route path="/cases/:id" element={<CaseDetails />} />
            <Route path="/evidence" element={<Evidence />} />
            <Route path="/ai-analysis" element={<AiAnalysis />} />
            <Route path="/graph" element={<RelationshipGraph />} />
            <Route path="/timeline" element={<TimelinePage />} />
            <Route path="/patterns" element={<Patterns />} />
            <Route path="/report" element={<IntelligenceReport />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>

      <CaseModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onCaseAdded={() => {}}
      />
    </div>
  );
}

function AppShell() {
  const location = useLocation();

  if (location.pathname === '/') {
    return <LandingPage />;
  }

  if (location.pathname === '/mission-complete') {
    return <MissionComplete />;
  }

  return <DashboardShell />;
}

export default function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}
