import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CaseModal from './components/CaseModal';

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

export default function App() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <Router>
      <div className="flex h-screen bg-[#0D1016] text-gray-100 overflow-hidden font-sans">
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Header */}
          <Header onUploadClick={() => setIsUploadOpen(true)} />

          {/* Page Routing */}
          <main className="flex-1 pb-10">
            <Routes>
              <Route path="/" element={<Dashboard />} />
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

        {/* Global Case Ingestion Modal */}
        <CaseModal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          onCaseAdded={() => {}}
        />
      </div>
    </Router>
  );
}
