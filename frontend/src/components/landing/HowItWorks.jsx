import React from 'react';
import { motion } from 'framer-motion';
import { Upload, ScanText, Tags, GitCommitHorizontal, Network, Fingerprint, Cpu, Target, FileCheck2 } from 'lucide-react';

const STEPS = [
  { icon: Upload, label: 'Upload Evidence', desc: 'Case files, statements, and evidence ingested.' },
  { icon: ScanText, label: 'OCR', desc: 'Text normalized from every evidence item.' },
  { icon: Tags, label: 'Entity Extraction', desc: 'People, vehicles, weapons, and addresses identified.' },
  { icon: GitCommitHorizontal, label: 'Timeline Generation', desc: 'Chronological event sequence reconstructed.' },
  { icon: Network, label: 'Relationship Graph', desc: 'Entities linked by co-occurrence and correlation.' },
  { icon: Fingerprint, label: 'Cold Case Matching', desc: 'Similarity scored against historical cases.' },
  { icon: Cpu, label: 'Pattern Discovery', desc: 'MO clusters surfaced across the case database.' },
  { icon: Target, label: 'Recommendation Engine', desc: 'Reopen priority calculated from live evidence.' },
  { icon: FileCheck2, label: 'Intelligence Report', desc: 'Findings and next steps compiled automatically.' },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-28 px-6 lg:px-10 bg-[#0A0D12]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[11px] font-mono tracking-[0.3em] text-[#3FA9A0] uppercase">How It Works</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3">
            Nine agents. One continuous chain.
          </h2>
        </motion.div>

        <div className="relative">
          {/* connecting spine */}
          <div className="hidden lg:block absolute top-11 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#232B36] to-transparent" />

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-9 gap-6 lg:gap-3">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.45, delay: i * 0.06 }}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="relative z-10 w-11 h-11 rounded-full bg-[#161B22] border border-[#C9902E]/40 flex items-center justify-center mb-3 shadow-goldGlow">
                    <Icon className="w-4.5 h-4.5 text-[#C9902E]" />
                  </div>
                  <span className="text-[10px] font-mono text-gray-600 mb-1">{String(i + 1).padStart(2, '0')}</span>
                  <p className="text-xs font-semibold text-white leading-tight mb-1">{step.label}</p>
                  <p className="text-[11px] text-gray-500 leading-snug hidden lg:block">{step.desc}</p>

                  {i < STEPS.length - 1 && (
                    <motion.div
                      className="hidden lg:flex absolute top-5.5 left-[calc(50%+22px)] w-[calc(100%-22px)] justify-end"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06 + 0.2 }}
                    >
                      <motion.div
                        className="text-[#3FA9A0] text-xs"
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        →
                      </motion.div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
