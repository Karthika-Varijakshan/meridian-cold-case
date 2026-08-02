import React from 'react';
import { motion } from 'framer-motion';
import { Upload, ScanText, Tags, GitCommitHorizontal, Network, Fingerprint, Cpu, Target, FileCheck2 } from 'lucide-react';

const AGENTS = [
  { icon: Upload, name: 'Upload Agent', desc: 'Validates and ingests case records for analysis.' },
  { icon: ScanText, name: 'OCR Agent', desc: 'Normalizes text extracted from evidence items.' },
  { icon: Tags, name: 'Entity Extraction Agent', desc: 'Identifies people, vehicles, weapons, and locations.' },
  { icon: GitCommitHorizontal, name: 'Timeline Reconstruction Agent', desc: 'Sequences events chronologically from case data.' },
  { icon: Network, name: 'Relationship Graph Agent', desc: 'Builds a co-occurrence network from extracted entities.' },
  { icon: Fingerprint, name: 'Case Similarity Agent', desc: 'Ranks historically similar cases by keyword correlation.' },
  { icon: Cpu, name: 'Crime Pattern Agent', desc: 'Clusters cases sharing a modus operandi.' },
  { icon: Target, name: 'Recommendation Agent', desc: 'Scores reopening priority from correlated evidence.' },
  { icon: FileCheck2, name: 'Investigation Report Agent', desc: 'Compiles the final intelligence report.' },
];

export default function AgentCards() {
  return (
    <section className="relative py-28 px-6 lg:px-10 bg-[#0A0D12]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[11px] font-mono tracking-[0.3em] text-[#3FA9A0] uppercase">AI Agents</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3">A real LangGraph StateGraph, nine agents deep</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {AGENTS.map((agent, i) => {
            const Icon = agent.icon;
            return (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
                whileHover={{ y: -4 }}
                className="glass-panel rounded-xl p-5 flex items-start space-x-4"
              >
                <div className="w-9 h-9 rounded-lg bg-[#C9902E]/15 border border-[#C9902E]/40 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-[#C9902E]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-semibold text-white truncate">{agent.name}</h3>
                    <span className="ml-2 flex-shrink-0 flex items-center space-x-1">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3FA9A0] opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#3FA9A0]" />
                      </span>
                      <span className="text-[9px] font-mono text-[#3FA9A0] tracking-wider">ACTIVE</span>
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{agent.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
