import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ArrowRight, RotateCcw, Home, Compass } from 'lucide-react';

import NetworkBackground from '../components/landing/NetworkBackground';
import PoweredBy from '../components/landing/PoweredBy';
import Footer from '../components/landing/Footer';
import { GithubIcon, LinkedinIcon } from '../components/shared/SocialIcons';
import { GITHUB_URL, LINKEDIN_URL, DEVELOPER_NAME, DEVELOPER_ROLE } from '../config/social';

import StatsGrid from '../components/mission-complete/StatsGrid';
import SummaryCard from '../components/mission-complete/SummaryCard';
import QuoteRotator from '../components/mission-complete/QuoteRotator';
import AboutCards from '../components/mission-complete/AboutCards';
import CinematicIntro from '../components/mission-complete/CinematicIntro';

import { getCases, getRelationshipGraph, getTimeline } from '../services/api';

const REAL_AGENT_COUNT = 9; // matches the actual LangGraph pipeline built in Phase 2

export default function MissionComplete() {
  const location = useLocation();
  const navigate = useNavigate();

  // Only play the cinematic fade-to-black intro when arriving via the
  // Exit Platform button (which passes this flag) — a direct visit or
  // page refresh shouldn't force everyone to sit through it every time.
  const [showCinematic, setShowCinematic] = useState(Boolean(location.state?.fromExit));
  const [showSpecialMessage, setShowSpecialMessage] = useState(false);
  const [messageStage, setMessageStage] = useState(0);

  const [stats, setStats] = useState({
    casesAnalysed: 0,
    agentsExecuted: REAL_AGENT_COUNT,
    entitiesIdentified: 0,
    relationshipsDiscovered: 0,
    timelineEvents: 0,
    reportGenerated: Boolean(location.state?.reportGenerated),
  });

  const session = location.state?.session || null;

  useEffect(() => {
    let cancelled = false;
    async function loadStats() {
      const [casesRes, graphRes, timelineRes] = await Promise.all([
        getCases(),
        getRelationshipGraph(),
        getTimeline(),
      ]);
      if (cancelled) return;
      setStats((prev) => ({
        ...prev,
        casesAnalysed: casesRes.total || 0,
        entitiesIdentified: graphRes.stats?.total_nodes || 0,
        relationshipsDiscovered: graphRes.stats?.total_edges || 0,
        timelineEvents: timelineRes.total || 0,
      }));
    }
    loadStats();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (showCinematic) return;
    const t = setTimeout(() => {
      setShowSpecialMessage(true);
      setMessageStage(1);
      setTimeout(() => setMessageStage(2), 3200);
    }, 3000);
    return () => clearTimeout(t);
  }, [showCinematic]);

  if (showCinematic) {
    return <CinematicIntro onDone={() => setShowCinematic(false)} />;
  }

  return (
    <div className="relative bg-[#0D1016] text-gray-100 font-sans antialiased overflow-x-hidden min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-10">
        <div className="absolute inset-0 bg-[#0D1016]" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(63,169,160,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(63,169,160,0.5) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <NetworkBackground density={36} />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(13,16,22,0.35) 0%, rgba(13,16,22,0.85) 70%, #0D1016 100%)',
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-[#C9902E] to-[#996414] flex items-center justify-center mx-auto mb-8 shadow-goldGlow"
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-3xl bg-[#C9902E]/30 blur-xl"
            />
            <ShieldCheck className="w-10 h-10 text-black relative z-10" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="font-mono font-bold text-4xl sm:text-5xl md:text-6xl tracking-[0.08em] text-white mb-4"
          >
            MISSION COMPLETE
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="text-lg text-[#3FA9A0] font-medium mb-6"
          >
            Investigation Successfully Processed
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="max-w-xl mx-auto text-gray-400 leading-relaxed"
          >
            Thank you for exploring MERIDIAN. The investigation has been securely analyzed using
            autonomous AI agents, timeline reconstruction, relationship mapping, and criminal
            intelligence analysis. All generated intelligence has been processed successfully.
          </motion.p>
        </div>
      </section>

      {/* Animated statistics */}
      <section className="relative py-16 px-6 lg:px-10">
        <div className="max-w-5xl mx-auto">
          <StatsGrid stats={stats} />
        </div>
      </section>

      {/* Mission summary card */}
      <section className="relative py-10 px-6 lg:px-10">
        <SummaryCard session={session} />
      </section>

      {/* Rotating quote */}
      <section className="relative px-6 lg:px-10 bg-[#0A0D12]">
        <QuoteRotator />
      </section>

      {/* Thank you */}
      <section className="relative py-24 px-6 lg:px-10">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Thank You for Exploring MERIDIAN
          </h2>
          <p className="text-gray-400 leading-relaxed">
            MERIDIAN demonstrates how Agentic AI can transform cold case investigations by
            discovering hidden relationships, reconstructing timelines, identifying criminal
            patterns, and assisting investigators with intelligent recommendations.
          </p>
        </div>
        <AboutCards />
      </section>

      {/* Technology */}
      <PoweredBy />

      {/* Call to action */}
      <section className="relative py-24 px-6 lg:px-10">
        <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => navigate('/ai-analysis')}
            className="group flex items-center space-x-2 bg-[#C9902E] hover:bg-[#E0A33B] text-black font-semibold px-6 py-3 rounded-xl transition-all shadow-goldGlow hover:shadow-[0_0_25px_rgba(201,144,46,0.45)]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Start New Investigation</span>
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl border border-[#232B36] text-gray-300 hover:text-white hover:border-[#3FA9A0]/50 transition-all"
          >
            <Home className="w-4 h-4 text-[#3FA9A0]" />
            <span>Back to Dashboard</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl border border-[#232B36] text-gray-300 hover:text-white hover:border-[#C9902E]/50 transition-all"
          >
            <Compass className="w-4 h-4 text-[#C9902E]" />
            <span>Visit Landing Page</span>
          </button>
          {GITHUB_URL && (
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-2 px-6 py-3 rounded-xl border border-[#232B36] text-gray-300 hover:text-white hover:border-gray-500 transition-all"
            >
              <GithubIcon className="w-4 h-4" />
              <span>View GitHub</span>
            </a>
          )}
          {LINKEDIN_URL && (
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-2 px-6 py-3 rounded-xl border border-[#232B36] text-gray-300 hover:text-white hover:border-gray-500 transition-all"
            >
              <LinkedinIcon className="w-4 h-4" />
              <span>LinkedIn</span>
            </a>
          )}
        </div>
      </section>

      {/* Developer section */}
      <section className="relative py-20 px-6 lg:px-10 bg-[#0A0D12]">
        <div className="max-w-md mx-auto text-center">
          <p className="text-xs font-mono tracking-[0.3em] text-gray-500 uppercase mb-2">Developed by</p>
          <h3 className="text-xl font-bold text-white mb-1">{DEVELOPER_NAME}</h3>
          <p className="text-sm text-[#3FA9A0]">{DEVELOPER_ROLE} · AI &amp; Full Stack Developer</p>
        </div>
      </section>

      <Footer />

      {/* Special delayed message */}
      <AnimatePresence>
        {showSpecialMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 glass-panel-gold rounded-xl px-6 py-3.5 text-center max-w-sm"
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={messageStage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="text-sm text-gray-200"
              >
                {messageStage === 1
                  ? 'Thank you for experiencing the future of criminal intelligence.'
                  : 'See you in the next investigation.'}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
