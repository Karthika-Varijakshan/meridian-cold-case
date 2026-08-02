import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle, ShieldCheck } from 'lucide-react';
import NetworkBackground from './NetworkBackground';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section id="top" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Layered background */}
      <div className="absolute inset-0 bg-[#0D1016]" />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(201,144,46,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(201,144,46,0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <NetworkBackground density={54} />

      {/* AI scan sweep */}
      <motion.div
        className="absolute inset-x-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, transparent, rgba(63,169,160,0.06), transparent)',
        }}
        initial={{ top: '-10%' }}
        animate={{ top: ['-10%', '110%'] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
      />

      {/* Radial vignette so text stays legible over the network */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 45%, rgba(13,16,22,0.4) 0%, rgba(13,16,22,0.85) 70%, #0D1016 100%)',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-[#C9902E]/40 bg-[#C9902E]/10 mb-8"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#C9902E]" />
          <span className="text-[11px] font-mono tracking-[0.25em] text-[#C9902E] uppercase">
            Agentic AI // Cold Case Intelligence
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-mono font-bold text-6xl sm:text-7xl md:text-8xl tracking-[0.08em] text-white mb-4"
        >
          MERIDIAN
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg sm:text-xl text-[#3FA9A0] font-medium tracking-wide mb-6"
        >
          Cold Case Intelligence Platform
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="max-w-2xl mx-auto text-gray-400 text-base sm:text-lg leading-relaxed mb-10"
        >
          Discover hidden relationships across decades of investigations using autonomous AI agents,
          timeline reconstruction, criminal network analysis, evidence correlation, and intelligent
          reopening recommendations.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="group flex items-center space-x-2 bg-[#C9902E] hover:bg-[#E0A33B] text-black font-semibold px-7 py-3.5 rounded-xl transition-all shadow-goldGlow hover:shadow-[0_0_25px_rgba(201,144,46,0.45)]"
          >
            <span>Launch Platform</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <a
            href="#how-it-works"
            className="group flex items-center space-x-2 px-7 py-3.5 rounded-xl border border-[#232B36] text-gray-300 hover:text-white hover:border-[#3FA9A0]/50 transition-all"
          >
            <PlayCircle className="w-4 h-4 text-[#3FA9A0]" />
            <span className="font-medium">Watch Demo</span>
          </a>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 w-5 h-9 rounded-full border border-gray-700 flex items-start justify-center p-1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          className="w-1 h-1.5 rounded-full bg-[#C9902E]"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
}
