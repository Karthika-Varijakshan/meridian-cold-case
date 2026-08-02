import React from 'react';
import { motion } from 'framer-motion';

/**
 * Illustrative in-CSS recreations of the real dashboard screens, framed in
 * device mockups. These are NOT actual screenshots (I have no way to
 * capture the live running app from here) — they're built to visually
 * match the real Dashboard/AI Analysis/Graph pages' layout and color
 * language closely enough to preview the product honestly.
 */
function MiniDashboard() {
  return (
    <div className="w-full h-full bg-[#0D1016] p-3 text-left overflow-hidden">
      <div className="flex items-center justify-between mb-2.5">
        <div className="h-2 w-16 rounded bg-[#C9902E]/60" />
        <div className="h-2 w-8 rounded bg-[#3FA9A0]/50" />
      </div>
      <div className="grid grid-cols-2 gap-1.5 mb-2">
        {[['20', '#C9902E'], ['13', '#D15B5B'], ['96%', '#3FA9A0'], ['5', '#C9902E']].map(([v, c], i) => (
          <div key={i} className="glass-panel rounded-md p-1.5">
            <div className="h-1 w-6 rounded bg-gray-700 mb-1" />
            <div className="text-[10px] font-mono font-bold" style={{ color: c }}>{v}</div>
          </div>
        ))}
      </div>
      <div className="glass-panel rounded-md p-1.5 h-10 flex items-end space-x-0.5">
        {[40, 65, 30, 80, 55, 90, 45].map((h, i) => (
          <div key={i} className="flex-1 rounded-sm bg-[#3FA9A0]/60" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}

function MiniAnalysis() {
  return (
    <div className="w-full h-full bg-[#0D1016] p-3 text-left overflow-hidden">
      <div className="h-2 w-20 rounded bg-[#C9902E]/60 mb-3" />
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center space-x-2 mb-1.5">
          <div className="w-3 h-3 rounded-full bg-[#3FA9A0]/50 flex-shrink-0" />
          <div className="h-1.5 rounded bg-gray-700 flex-1" style={{ opacity: 1 - i * 0.15 }} />
        </div>
      ))}
      <div className="mt-2 h-6 rounded bg-[#C9902E]/15 border border-[#C9902E]/30" />
    </div>
  );
}

function MiniGraph() {
  return (
    <div className="w-full h-full bg-[#0D1016] p-3 relative overflow-hidden">
      <svg viewBox="0 0 100 60" className="w-full h-full">
        <line x1="20" y1="15" x2="50" y2="35" stroke="#C9902E" strokeWidth="0.5" opacity="0.5" />
        <line x1="50" y1="35" x2="80" y2="20" stroke="#3FA9A0" strokeWidth="0.5" opacity="0.5" />
        <line x1="50" y1="35" x2="35" y2="50" stroke="#C9902E" strokeWidth="0.5" opacity="0.5" />
        <circle cx="20" cy="15" r="3" fill="#C9902E" />
        <circle cx="50" cy="35" r="4" fill="#3FA9A0" />
        <circle cx="80" cy="20" r="3" fill="#C9902E" />
        <circle cx="35" cy="50" r="2.5" fill="#D15B5B" />
      </svg>
    </div>
  );
}

const SCREENS = [
  { name: 'Dashboard', Comp: MiniDashboard },
  { name: 'AI Analysis', Comp: MiniAnalysis },
  { name: 'Relationship Graph', Comp: MiniGraph },
];

function DeviceFrame({ variant, children }) {
  if (variant === 'laptop') {
    return (
      <div className="relative mx-auto" style={{ width: '100%', maxWidth: 640 }}>
        <div className="rounded-t-xl border-[6px] border-[#1C232D] bg-[#0D1016] aspect-video overflow-hidden">
          {children}
        </div>
        <div className="h-3 bg-gradient-to-b from-[#232B36] to-[#161B22] rounded-b-lg mx-6" />
        <div className="h-1 bg-[#0A0D12] rounded-b-md mx-12" />
      </div>
    );
  }
  if (variant === 'tablet') {
    return (
      <div className="rounded-2xl border-[6px] border-[#1C232D] bg-[#0D1016] overflow-hidden" style={{ aspectRatio: '4/5' }}>
        {children}
      </div>
    );
  }
  return (
    <div className="rounded-[1.75rem] border-[6px] border-[#1C232D] bg-[#0D1016] overflow-hidden" style={{ aspectRatio: '9/18' }}>
      {children}
    </div>
  );
}

export default function DashboardPreview() {
  return (
    <section className="relative py-28 px-6 lg:px-10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[11px] font-mono tracking-[0.3em] text-[#C9902E] uppercase">Live Platform</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3">
            Built for the desk, the tablet, the field
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-end">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
            className="lg:col-span-2"
          >
            <DeviceFrame variant="laptop">
              <MiniDashboard />
            </DeviceFrame>
            <p className="text-center text-xs text-gray-500 mt-3 font-mono">Dashboard — Desktop</p>
          </motion.div>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ scale: 1.03 }}
              className="max-w-[220px] mx-auto"
            >
              <DeviceFrame variant="tablet">
                <MiniAnalysis />
              </DeviceFrame>
              <p className="text-center text-xs text-gray-500 mt-3 font-mono">AI Analysis — Tablet</p>
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 mt-14 max-w-2xl mx-auto">
          {SCREENS.map(({ name, Comp }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ scale: 1.04 }}
            >
              <div className="rounded-lg border border-[#232B36] overflow-hidden aspect-[4/3]">
                <Comp />
              </div>
              <p className="text-center text-[11px] text-gray-500 mt-2 font-mono">{name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
