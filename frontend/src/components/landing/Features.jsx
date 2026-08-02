import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Clock, Network, Bot, FileText, Link2 } from 'lucide-react';

const FEATURES = [
  {
    icon: Eye,
    title: 'Hidden Pattern Discovery',
    desc: 'Automatically detect hidden criminal behavior patterns across decades of case data.',
    accent: '#C9902E',
  },
  {
    icon: Clock,
    title: 'Timeline Reconstruction',
    desc: 'Rebuild complex investigations from evidence, witness statements, and case records.',
    accent: '#3FA9A0',
  },
  {
    icon: Network,
    title: 'Criminal Network Analysis',
    desc: 'Interactive relationship graphs connecting suspects, vehicles, weapons, and locations.',
    accent: '#C9902E',
  },
  {
    icon: Bot,
    title: 'Autonomous AI Agents',
    desc: 'A nine-agent LangGraph investigation engine that ingests, extracts, correlates, and reports.',
    accent: '#3FA9A0',
  },
  {
    icon: FileText,
    title: 'Intelligence Reports',
    desc: 'Automatically generate investigative reports with findings, confidence, and next steps.',
    accent: '#C9902E',
  },
  {
    icon: Link2,
    title: 'Evidence Correlation',
    desc: 'Connect evidence across decades of investigations to surface cases worth reopening.',
    accent: '#3FA9A0',
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-28 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[11px] font-mono tracking-[0.3em] text-[#C9902E] uppercase">Capabilities</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3">
            An investigation engine, not a form
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                whileHover={{ y: -6 }}
                className="group relative glass-panel rounded-2xl p-7 overflow-hidden"
              >
                <div
                  className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                  style={{ background: f.accent }}
                />
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${f.accent}1A`, border: `1px solid ${f.accent}40` }}
                >
                  <Icon className="w-5 h-5" style={{ color: f.accent }} />
                </motion.div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
